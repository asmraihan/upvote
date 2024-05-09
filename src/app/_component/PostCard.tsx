"use client";

import { formatTimeToNow } from '@/lib/utils';
import Link from 'next/link';
import React, { useRef } from 'react'
import RenderBlock from './RenderBlock';
import { MessageSquare } from 'lucide-react'
import PostVoteClient from './PostVoteClient';


interface PostCardProps {
  post: any; 
  voteCount: number;
  currentVote: any;
  commentCount: number;
}


const PostCard: React.FC<PostCardProps> = ({ post, voteCount, currentVote, commentCount }) => {
  
  const pRef = useRef<HTMLParagraphElement>(null)

console.log(pRef.current?.clientHeight)

  console.log(post)
  
  return (
    <div className='rounded-md bg-white dark:bg-neutral-900 shadow'>
    <div className='px-6 py-4 flex justify-between'>
      <PostVoteClient
        postId={post.id}
        initialVoteCount={voteCount}
        initialVote={currentVote?.type}
      />

      <div className='w-0 flex-1'>
        <div className='max-h-40 mt-1 text-xs text-gray-500 dark:text-gray-300'>
         
          <span>Posted by • {post.author.username}</span>{' '}
          {formatTimeToNow(new Date(post.createdAt))}
        </div>
        <Link href={`/post/${post.id}`}>
          <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900 dark:text-white'>
            {post.title}
          </h1>
        </Link>

        <div
          className='relative text-sm max-h-40 w-full overflow-clip'
          ref={pRef}>
          <RenderBlock content={post.content} />
          {pRef.current?.clientHeight === 160 ? (
            // blur bottom if content is too long
            <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent dark:from-neutral-900 dark:to-transparent'>

            </div>
          ) : null}
        </div>
      </div>
    </div>

    <div className='z-20 text-sm px-4 py-4 sm:px-6 bg-gray-50 dark:bg-neutral-800'>
      <Link
        href={`/post/${post.id}`}
        className='w-fit flex items-center gap-2'>
          <MessageSquare className='h-4 w-4' /> {commentCount} comments
      </Link>
    </div>
  </div>
  )
}

export default PostCard