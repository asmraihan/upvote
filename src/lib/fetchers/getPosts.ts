
"use server";

// import { cookies } from "next/headers";
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { prisma } from "../../../prisma/prismaClient";

export const getPosts = async (page = 1) => {
    try {
      const post = await prisma.post.findMany({
        include: {
          votes: true,
          comments: true,
          author: true
        },
        skip: (page - 1) * 10,
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }

      });
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
  