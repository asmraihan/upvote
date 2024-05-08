import { Vote } from "@prisma/client";


export type UserType = {
    username: string;
    email: string;
    profilePictureUrl: string;
    id: string;
};


// payload for the redis cache
export type CachedPostType = {
    id: string;
    title: string;
    authorUsername : string;
    content: string;
    currentVote: Vote["type"] | null;
    createdAt: string;
}