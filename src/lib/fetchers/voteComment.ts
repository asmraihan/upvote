
"use server";

// import { cookies } from "next/headers";
import { prisma } from "@/lib/prismaClient";
import { CommentVoteRequest, CommentVoteValidator } from '../validators/vote';
import { getServerSession } from "../lucia/luciaAuth";

export const voteComment = async (data: CommentVoteRequest) => {
    try {
        const { commentId, type } = CommentVoteValidator.parse(data)

        console.log(commentId, type, "data vote")

        const user = await getServerSession()
        if (!user) return { error: "User not authenticated" };

        const existingVote = await prisma.commentVote.findFirst({
            where: {
                commentId,
                userId: user?.user?.id
            }
        });


        if (existingVote) {
            if (existingVote.type === type) {
                await prisma.commentVote.delete({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: user?.user?.id!
                        }
                    }
                });
                return {
                    success: true,
                    message: "Vote removed"
                }
            } else {
                await prisma.commentVote.update({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: user?.user?.id!
                        }
                    },
                    data: {
                        type
                    }
                });
            }

            return {
                success: true,
                message: "Vote updated"
            }
        }

        await prisma.commentVote.create({
            data: {
                type,
                userId: user?.user?.id!,
                commentId
            }
        });

        return {
            success: true,
            message: "Vote added"
        };
    } catch (error: any) {
        return {
            error: error?.message,
        };
    }
};
