"use client"

import { getPosts } from '@/lib/fetchers/getPosts'
import { Comment, Post, User, Vote } from '@prisma/client'
import React from 'react'

import { useIntersectionObserver } from 'usehooks-ts'

interface PostFeedProps {
    initialData : Post & {
        votes: Vote[],
        author: User,
        comments: Comment[]
    }
}
const PostFeed = ({initialData} : PostFeedProps) => {

    const lastPostRef = React.useRef<HTMLDivElement>(null)

    const { isIntersecting, ref } = useIntersectionObserver({
        root : lastPostRef.current,
        threshold: 0.5
      })

      React.useEffect(() => {
        const fetchPosts = async () => {
            const res = await getPosts();
            console.log(res.data)
            if (isIntersecting) {
           
                // do something with posts
            } else {
                console.log('not intersecting');
            }
        };
    
        fetchPosts();
    }, [isIntersecting]);
      
  return (
    <div>
        <ul className='flex flex-col col-span-2 space-y-6'>

        </ul>
    </div>
  )
}

export default PostFeed