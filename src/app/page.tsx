import { redirect } from "next/navigation";

import { signOut } from "@/lib/actions/auth.actions";

import { validateRequest } from "@/lib/lucia/luciaAuth";

import { Button, buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { Container } from "@/components/shared/container";
import Link from "next/link";

export default async function Home() {
  const { user } = await validateRequest();

  // if (!user) {
  //   return redirect("/signin");
  // }

  return (
    <Container className="mt-4 lg:mt-6">
      <h1 className="font-bold text-3xl md:text-4xl">Latest Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4  py-6">
        {/* feed */}

        {/* post info */}
        <div className=" overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last  dark:border-gray-900">
          <div className="bg-emerald-100 px-6 py-4 dark:bg-black/20">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="size-4" /> Home
            </p>
          </div>
          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">See Whats New in the Feed.</p>
            </div>
          </div>
          <div className="px-6">
            <Link
              href="/create"
              className={buttonVariants({
                className: "w-full mt-4 mb-6 ",
              })}
            >
              Create a Post
            </Link>
          </div>

        </div>
      </div>
    </Container>
  );
}





/* 
   <form action={signOut}>
        <Button type="submit">Sign out</Button>
      </form>
*/