
"use server";

// import { cookies } from "next/headers";
import { prisma } from "@/lib/prismaClient";
import { PostVoteRequest, PostVoteValidator } from '../validators/vote';
import { getServerSession } from "../lucia/luciaAuth";
import { CachedPostType } from "../types";
import { redis } from "../redis.config";


const CACHE_ON_COUNT = 10

export const votePost = async (data: PostVoteRequest) => {
    try {
        console.log(data, "data vote")
        const { postId, type } = PostVoteValidator.parse(data)

        console.log(postId, type, "data vote")

        const user = await getServerSession()
        console.log(user, "user vote")

        if (!user) {
            return {
                error: "User not authenticated",
            };
        }

        const existingVote = await prisma.vote.findFirst({
            where: {
                postId,
                userId: user?.user?.id
            }
        });

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePictureUrl: true
                    }
                },
                votes: true
            }
        })

        if (!post) {
            return {
                error: "Post not found"
            }
        }

        if (existingVote) {
            if (existingVote.type === type) {
                await prisma.vote.delete({
                    where: {
                        userId_postId: {
                            postId,
                            userId: user?.user?.id!
                        }
                    }
                });
                return {
                    success: true,
                    message: "Vote removed"
                }
            }

            await prisma.vote.update({
                where: {
                    userId_postId: {
                        postId,
                        userId: user?.user?.id!
                    }
                },
                data: {
                    type
                }
            });

            // recounting votes 
            const voteCount = post.votes.reduce((acc, vote) => {
                if (vote.type === "UP") return acc + 1
                if (vote.type === "DOWN") return acc - 1
                return acc
            }, 0)

            // caching for tending/high upvoted posts
            if (voteCount >= CACHE_ON_COUNT) {
                const cachePayload: CachedPostType = {
                    authorUsername: post.author.username ?? "",
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    currentVote: type,
                    createdAt: post.createdAt.toString()
                }

                await redis.hset(`post:${postId}`, cachePayload)
            }

            return {
                success: true,
                message: "Vote updated"
            }
        }

        await prisma.vote.create({
            data: {
                type,
                userId: user?.user?.id!,
                postId
            }
        });

        // recounting votes 
        const voteCount = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1
            if (vote.type === "DOWN") return acc - 1
            return acc
        }, 0)

        // caching for tending/high upvoted posts
        if (voteCount >= CACHE_ON_COUNT) {
            const cachePayload: CachedPostType = {
                authorUsername: post.author.username ?? "",
                content: JSON.stringify(post.content),
                id: post.id,
                title: post.title,
                currentVote: type,
                createdAt: post.createdAt.toString()
            }

            await redis.hset(`post:${postId}`, cachePayload)
        }
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
