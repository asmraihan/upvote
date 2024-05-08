"use client";

import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/providers/SessionProvider';
import { cn } from '@/lib/utils';
import { VoteType } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import React, { FC, useEffect } from 'react'

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
    console.log(sessionData)
    // first need check login toast
    const setVote = async (type: VoteType) => {
        console.log(type)
    }



    const [voteCount, setVoteCount] = React.useState(initialVoteCount)
    const [currentVote, setCurrentVote] = React.useState(initialVote)

    const previousVote = React.useRef(currentVote)

    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])

    return (
        <div className='flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
        {/* upvote */}
        <Button
          onClick={() => setVote('UP')}
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
          onClick={() => setVote('DOWN')}
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