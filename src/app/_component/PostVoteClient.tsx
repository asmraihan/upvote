"use client";

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { votePost } from '@/lib/fetchers/votePost';
import { useSession } from '@/lib/providers/SessionProvider';
import { cn } from '@/lib/utils';
import { PostVoteRequest } from '@/lib/validators/vote';
import { VoteType } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import React, { FC, startTransition, useEffect } from 'react'

interface PostVoteClientProps {
    postId: string,
    initialVoteCount: number
    initialVote?: VoteType | null,
}

const PostVoteClient: FC<PostVoteClientProps> = ({
    postId,
    initialVote,
    initialVoteCount
}) => {

    const sessionData = useSession()

    const [voteCount, setVoteCount] = React.useState(initialVoteCount)
    const [currentVote, setCurrentVote] = React.useState(initialVote)

    console.log(currentVote)
    console.log(initialVote)

    // create a usePrevious hook to store the previous value of voteCount using useRef
    const usePrevious = (value: string) => {
        const ref = React.useRef<string>()
        React.useEffect(() => {
            ref.current = value
        }, [value])
        return ref.current
    }

    const prevVote = usePrevious(currentVote!)

    console.log(prevVote)

    useEffect(() => {
        if (initialVote) {
            setCurrentVote(initialVote)
        }
    }, [initialVote])

    console.log(voteCount, "voteCount")

    // first need check login toast
    const submitVote = (type: VoteType) => {
        console.log(type)
        const payload: PostVoteRequest = {
            postId,
            type
        }
        startTransition(() => {
            votePost(payload).then(res => {
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

                }
            }).catch(error => {
                console.error(error);
                // Handle error
            });
        });
    }


    return (
        <div className='flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
            {/* upvote */}
            <Button
                onClick={() => submitVote('UP')}
                size='sm'
                variant='ghost'
                aria-label='upvote'>
                <ArrowBigUp
                    className={cn('h-5 w-5 text-zinc-700 dark:text-white', {
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
                    className={cn('h-5 w-5 text-zinc-700 dark:text-white', {
                        'text-red-500 fill-red-500': currentVote === 'DOWN',
                    })}
                />
            </Button>
        </div>
    )
}

export default PostVoteClient