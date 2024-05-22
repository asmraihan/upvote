"use client"
import { Comment, VoteType } from '@prisma/client'
import Image from 'next/image'
import React, { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTimeToNow } from '@/lib/utils'

interface PostCommentProps {
  comment: Comment & {
    author: {
      id: string
      username: string
      profilePictureUrl: string
    }
  }
  currentVote: any
  votesAmt: number
  postId: string
}

const PostComment = (
  {
    comment,
    currentVote,
    votesAmt,
    postId
  }: PostCommentProps
) => {

  const commentRef = useRef<HTMLDivElement>(null)

  return (
    <div className='flex flex-col'>
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePictureUrl} />
          <AvatarFallback>
            {comment?.author?.username}
          </AvatarFallback>
        </Avatar>
        <div className='ml-2 flex flex-col'>
          <p className='text-sm font-medium text-gray-900'>
            u/{comment.author.username}
            </p>
            <p className='max-h-40 truncate text-xs text-zinc-500'>
              {formatTimeToNow(new Date(comment.createdAt))}
            </p>
        </div>
      </div>
      <p className='text-sm text-zinc-900'>
        {comment.text}
      </p>
    </div>
  )
}

export default PostComment