
"use server";

// import { cookies } from "next/headers";
import { prisma } from "@/lib/prismaClient";
import { CommentType, CommentValidator } from "../validators/comment";
import { getServerSession } from "../lucia/luciaAuth";

export const createComment = async (values: CommentType) => {
  try {
    CommentValidator.parse(values);
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  try {

    const { user } = await getServerSession();

    if (!user) {
      return {
        error: 'Unauthorized',
      };
    }

    const post = await prisma.comment.create({
      data: {
        text: values.text,
        postId: values.postId,
        authorId: user.id,
        replyToId: values.replyToId,
      }
    })

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
