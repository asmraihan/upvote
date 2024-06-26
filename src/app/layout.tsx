
import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme-provider";
import { GeistSans } from "geist/font";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "@/lib/lucia/luciaAuth";
import { SessionProvider } from "@/lib/providers/SessionProvider";
import Navbar from "@/components/shared/navbar";
import "@/styles/globals.css"

export const runtime = "edge";

const title = "UpVote - Next";
const description =
  "UpVote - Next is a forum where you can ask questions, share your knowledge, and learn from others."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@asmraihan",
  },
  // metadataBase: new URL("https://code-blocks.vercel.app/"),
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await getServerSession();
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      {/* <AuthProvider> */}
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider value={sessionData}>
            <Navbar user={sessionData.user} />
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
      {/* </AuthProvider> */}
    </html>
  );
}