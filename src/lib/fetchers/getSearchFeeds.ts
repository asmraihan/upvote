
"use server";

import { prisma } from "@/lib/prismaClient";

export const getSearchFeed = async ({ query }: { query: string }) => {

    console.log(query)
    try {
        if (query.length === 0) {
            return null
        }

        const postResults = await prisma.post.findMany({
            where: {
                title: {
                    contains: query,
                    mode: "insensitive"
                }

            },
            include: {
                _count: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10

        });

        const commentResults = await prisma.comment.findMany({
            where: {
                text: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            include: {
                post: true
            },
            take: 10
        });


        const userResults = await prisma.user.findMany({
            where: {
                username: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                username: true,
                email: true,
            },
            take: 10
        });

        return {
            success: true,
            data: [
                { name: "Posts", items: postResults },
                { name: "Comments", items: commentResults },
                { name: "Users", items: userResults },
              ],

        };
    } catch (error: any) {
        return {
            error: error?.message,
        };
    }
};
