"use client";

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { votePost } from '@/lib/fetchers/votePost';
import { useSession } from '@/lib/providers/SessionProvider';
import { cn } from '@/lib/utils';
import { CommentVoteRequest } from '@/lib/validators/vote';
import { VoteType } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import React, { FC, startTransition, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { voteComment } from '@/lib/fetchers/voteComment';


interface VoteCommentClientProps {
    commentId: string,
    initialVoteCount: number
    initialVote?: any
}

const VoteComment: FC<VoteCommentClientProps> = ({
    commentId,
    initialVote,
    initialVoteCount
}) => {
    console.log(commentId, initialVoteCount, initialVote, "voteComment")
    const sessionData = useSession()
    const [voteCount, setVoteCount] = React.useState(initialVoteCount)
    const [currentVote, setCurrentVote] = React.useState(initialVote)

    const router = useRouter()

    // create a usePrevious hook to store the previous value of voteCount using useRef
    const usePrevious = (value: string) => {
        const ref = React.useRef<string>()
        React.useEffect(() => {
            ref.current = value
        }, [value])
        return ref.current
    }

    const prevVote = usePrevious(currentVote as string)

    console.log(prevVote)


    console.log(voteCount, "voteCount")

    // first need check login toast
    const submitVote = (type: VoteType) => {
        if (!sessionData.user) {
            toast({
                variant: "default",
                description: "You need to login to vote",
            });
            return
        }

        if (currentVote === type) {
            setCurrentVote(undefined)
        } else {
            setCurrentVote(type)
        }

        const payload: CommentVoteRequest = {
            commentId,
            type
        }
        startTransition(() => {
            voteComment(payload).then(res => {
                console.log(res)
                if (res.error) {
                    console.log(res.error)
                    if (type === 'UP') {
                        setVoteCount((prev) => prev - 1)
                    } else {
                        setVoteCount((prev) => prev + 1)
                    }
                    // reset current vote
                    setCurrentVote(prevVote as VoteType)

                } else if (res.success) {
                    console.log("Submission successful");
                    console.log(currentVote, type)
                    if (currentVote === type) {
                        setCurrentVote(undefined)
                        if (type === 'UP') {
                            setVoteCount((prev) => prev - 1)
                        } else if (type === 'DOWN') {
                            setVoteCount((prev) => prev + 1)
                        }
                    } else {
                        setCurrentVote(type)
                        if (type === 'UP') {
                            setVoteCount((prev) => prev + (currentVote ? 2 : 1))
                        } else if (type === 'DOWN') {
                            setVoteCount((prev) => prev - (currentVote ? 2 : 1))
                        }
                    }
                    // refresh router
                    router.refresh()

                }
            }).catch(error => {
                console.error(error);
                // Handle error
            });
        });
    }


    return (
        <div className='flex gap-1'>
            {/* upvote */}
            <Button
                onClick={() => submitVote('UP')}
                size='sm'
                variant='ghost'
                aria-label='upvote'>
                <ArrowBigUp
                    className={cn('size-6 text-zinc-700 dark:text-white', {
                        'text-emerald-500 fill-emerald-500': currentVote === 'UP',
                    })}
                />
            </Button>

            {/* score */}
            <p className='text-center py-2 font-medium text-sm text-zinc-900 dark:text-white'>
                {voteCount}
            </p>

            {/* downvote */}
            <Button
                onClick={() => submitVote('DOWN')}
                size='sm'
                className={cn({
                    'text-emerald-500': currentVote === 'DOWN',
                })}
                variant='ghost'
                aria-label='downvote'>
                <ArrowBigDown
                    className={cn('size-6 text-zinc-700 dark:text-white', {
                        'text-red-500 fill-red-500': currentVote === 'DOWN',
                    })}
                />
            </Button>
        </div>
    )
}

export default VoteComment