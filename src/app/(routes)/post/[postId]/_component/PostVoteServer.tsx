import PostVoteClient from '@/app/_component/PostVoteClient';
import { getServerSession } from '@/lib/lucia/luciaAuth';
import { Post, Vote, VoteType } from '@prisma/client';
import { notFound } from 'next/navigation';
import React from 'react'

interface PostVoteProps {
    postId: string;
    initialVoteCount?: number;
    initialVote?: VoteType 
    getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const PostVoteServer = async ({
    postId,
    initialVoteCount,
    initialVote,
    getData
}: PostVoteProps) => {

    const session = await getServerSession();
    console.log(session)

    let voteCount: number = 0
    let currentVote: VoteType | undefined = undefined

    if (getData) {
        const post = await getData()
        if (!post) return notFound()

        voteCount = post?.votes?.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1
            return acc
        }, 0)

        currentVote = post?.votes?.find(vote => vote.userId === session?.user?.id)?.type
    } else {
        voteCount = initialVoteCount!
        currentVote = initialVote 
    }

    return <PostVoteClient postId={postId} initialVoteCount={voteCount} initialVote={currentVote} />
}

export default PostVoteServer