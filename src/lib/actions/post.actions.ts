
"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { prisma } from "../../../prisma/prismaClient";

export const createPost = async (values: z.infer<typeof PostValidator>) => {
    try {
        PostValidator.parse(values);
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  
    try {
      const post = await prisma.post.create({
        data: {
            title : values.title,
            content : values.content,
            authorId : values.authorId
        },
        select: { id: true, title: true },
      });
  
      return {
        success: true,
        data: {
          userId: post.id,
        },
      };
    } catch (error: any) {
      return {
        error: error?.message,
      };
    }
  };
  