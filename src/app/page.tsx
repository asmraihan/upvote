import { redirect } from "next/navigation";

import { signOut } from "@/lib/actions/auth.actions";

import { validateRequest } from "@/lib/lucia/luciaAuth";

import { Button, buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { Container } from "@/components/shared/container";
import Link from "next/link";
import PostFeed from "./PostFeed";

export default async function Home() {
  const { user } = await validateRequest();
  console.log(user)
  // if (!user) {
  //   return redirect("/signin");
  // }

  return (
    <Container className="mt-4 lg:mt-6">
      <h1 className="font-bold text-3xl md:text-4xl">Latest Feed</h1>
      <div className="grid grid-cols-1 gap-y-4 md:gap-x-4 py-6">
        {/* feed */}
        <PostFeed user={user} />
      </div>
    </Container>
  );
}

/* 
   <form action={signOut}>
        <Button type="submit">Sign out</Button>
      </form>
*/