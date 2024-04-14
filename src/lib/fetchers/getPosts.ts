
"use server";

// import { cookies } from "next/headers";
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { prisma } from "../../../prisma/prismaClient";

export const getPosts = async () => {
    try {
      const post = await prisma.post.findMany({});
      return {
        success: true,
        data: post
      };
    } catch (error: any) {
      return {
        error: error?.message,
      };
    }
  };
  