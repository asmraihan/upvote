
import "@/styles/globals.css"
import type { Metadata } from "next";

import { ThemeProvider } from "@/lib/theme-provider";

import { GeistSans } from "geist/font";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/shared/navbar";
import { validateRequest } from "@/lib/lucia/luciaAuth";

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
  const { user } = await validateRequest();
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      {/* <AuthProvider> */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar session={user} />
          {children}
          {/* div wrapping the footer so that its at bottom of page */}
          <Toaster />
        </ThemeProvider>
      </body>
      {/* </AuthProvider> */}
    </html>
  );
}