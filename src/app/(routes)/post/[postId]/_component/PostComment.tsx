"use client"
import { Comment, CommentVote, VoteType } from '@prisma/client'
import Image from 'next/image'
import React, { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTimeToNow } from '@/lib/utils'
import VoteComment from './VoteComment'

interface PostCommentProps {
  comment: Comment & {
    author: {
      id: string;
      username: string;
      email: string | null;
      password: string | null;
      profilePictureUrl: string | null;
    }
  }
  currentVote: CommentVote | undefined
  voteCount: number
  postId: string
}

const PostComment = (
  {
    comment,
    currentVote,
    voteCount,
    postId
  }: PostCommentProps
) => {

  const commentRef = useRef<HTMLDivElement>(null)

  return (
    <div className='flex flex-col'>
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePictureUrl!} />
          <AvatarFallback>
            {comment?.author?.username}
          </AvatarFallback>
        </Avatar>
        <div className='ml-2 flex flex-col'>
          <p className='text-sm font-medium text-gray-900'>
           @{comment.author.username}
            </p>
            <p className='max-h-40 truncate text-xs text-zinc-500'>
              {formatTimeToNow(new Date(comment.createdAt))}
            </p>
        </div>
      </div>
      <p className='text-sm text-zinc-900'>
        {comment.text}
      </p>
      <div className='flex gap-2 items-center'>
        <VoteComment commentId={comment.id} initialVote={currentVote} initialVoteCount={voteCount} />
      </div>
    </div>
  )
}

export default PostComment