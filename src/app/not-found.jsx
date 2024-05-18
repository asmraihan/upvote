import React from "react";
import { Container } from "@/components/shared/container";
import Link from "next/link";

const NotFound = () => {
  return (
    <Container className="flex h-full justify-center items-center pt-20 sm:pt-24 lg:pt-32">
    <div className="flex flex-col items-center ">
      <p className="font-display text-3xl font-semibold text-neutral-950 sm:text-5xl">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-neutral-950">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Sorry, we could ont find the page you are looking for.
      </p>
      <Link
        href="/"
        className="mt-4 text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
      >
        Go to the home page
      </Link>
    </div>
  </Container>
  );
};

export default NotFound;
