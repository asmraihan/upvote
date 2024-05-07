"use client";

import React, { useState, useEffect, useRef } from 'react'
import { useInView } from "react-intersection-observer";

import { getPosts } from '@/lib/fetchers/getPosts'
import PostCard from './PostCard';
import SVGLoader from '@/components/shared/SVGLoader';
import { UserType } from '@/lib/types';

interface Vote {
    id: number;
    type: string;
    userId: number;
    postId: number;
}

interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    votes: Vote[];
    comments: Comment[];
}

let page = 2;

const MoreFeed = ({ user }: { user: UserType | null }) => {
    const [data, setData] = useState<any>({});
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const { ref, inView } = useInView();

/*  
 {
    success: true,
    totalPost: 12,
    totalPages: 4,
    currentPage: 16,
    currentLimit: 3,
    data: []
  } 
  */

    useEffect(() => {
        if (inView && hasMore) {

            setLoading(true);
            // Add a delay of 500 milliseconds
            const delay = 500;

            const timeoutId = setTimeout(() => {
                getPosts(page, 3).then((res) => {
                    console.log(res)
                    setData(res)
                    setPosts([...posts, ...res.data]);
                    if (res.data.length === 0) {
                        setHasMore(false);
                    } else {
                        page++;
                    }
                });

                setLoading(false);
            }, delay);

            // Clear the timeout if the component is unmounted or inView becomes false
            return () => clearTimeout(timeoutId);
        }
    }, [inView, posts, loading, hasMore]);

    return (
        <>
            <ul className='flex flex-col col-span-6 space-y-6 my-5'>
                {
                    posts?.map((post, index) => {
                        const voteCount = post.votes.reduce((acc, vote) => {
                            if (vote.type === "UP") return acc + 1
                            if (vote.type === "DOWN") return acc - 1
                            return acc
                        }, 0)

                        const currentVote = post.votes.find(vote => vote.userId === +user?.id)

                        if (index === posts.length - 1) {
                            return (
                                <li key={post.id} /* ref={ref} */>
                                    <PostCard post={post} voteCount={voteCount} currentVote={currentVote} />
                                </li>
                            )
                        } else {
                            return (
                                <li key={post.id}>
                                    <PostCard post={post} voteCount={voteCount} currentVote={currentVote} />
                                </li>
                            )
                        }
                    })
                }
            </ul>
            <section className="flex justify-center items-center w-full">
                <div ref={ref}>
                    {inView && loading && (
                       <>
                       {
                        data.data?.length > 0 ? (
                          <SVGLoader color='#C3C3C3' size={40}/>
                        ) : (
                            <p className="text-center text-gray-500">No more posts</p>
                        )
                       }
                     
                       </>
                    )}
                </div>
            </section>
        </>
    )
}

export default MoreFeed