
"use server";

// import { cookies } from "next/headers";
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { prisma } from "@/lib/prismaClient";

export const getPosts = async (page = 1, limit = 3) => {
  try {
    if (page <= 0) {
      page = 1
    }

    if (limit <= 0 || limit > 100) {
      limit = 3
    }
    const skip = (page - 1) * limit

    const post = await prisma.post.findMany({
      include: {
        votes: true,
        comments: true,
        author: true
      },
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc'
      }

    });

    const totalPost = await prisma.post.count()
    const totalPages = Math.ceil(totalPost / limit)

    return {
      success: true,
      totalPost,
      totalPages,
      currentPage: page,
      currentLimit: limit,
      data: post

    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
