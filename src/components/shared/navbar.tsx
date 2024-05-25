"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

import { CodeIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import ProfileDropdown from "./profile-dropdown";
import { ModeToggle } from "./mode-toggle";

import Cmdk from "./cmdk";
import { ArrowBigUp, PenLine } from "lucide-react";
import { UserType } from "@/lib/types";

export default function Navbar({ user }: { user: UserType | null  }) {
  console.log(user)
  const pathname = usePathname();
  const router = useRouter();

  const signIn = () => {
    router.push("/signin");
  }

  return (
    <header
      className={`sticky top-0 border-b px-3 z-50 bg-background`}>
      <nav
        className="flex items-center justify-between gap-2 py-3 mx-auto max-w-7xl"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <Link href="/" className="flex items-center space-x-1">
            <ArrowBigUp className="h-[1.6rem] w-[1.6rem]" />
            <span className="font-semibold inline-block">UpVote</span>
          </Link>
          <div className="hidden md:flex md:gap-x-12">
            <Link
              href="/create"
              prefetch={false}
              className={cn(
                "transition-colors hover:text-foreground/80 text-sm font-normal flex items-center gap-x-1",
                pathname === "/create"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              <PenLine className="size-4"/>
              Create
            </Link>


          </div>
        </div>

        <Cmdk user={user} />

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            {/* <Menu className="h-6 w-6" aria-hidden="true" /> */}
          </button>
        </div>
        <div className="flex items-center ">

          {user && <ProfileDropdown user={user} />}

          {!user && (
            <Button
              variant="default"
              onClick={() => signIn()}
              className="mx-8"
            >
              Log in
            </Button>
          )}
          <div className="hidden md:flex">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}