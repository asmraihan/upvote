'use client'
import { getPosts } from '@/lib/fetchers/getPosts'
import { Comment, Post, User, Vote } from '@prisma/client'
import React, { useState, useEffect, useRef } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import PostCard from './PostCard'

interface PostFeedProps {
    initialData: Post & {
        votes: Vote[],
        author: User,
        comments: Comment[]
    }
}

const PostFeed = ({ initialData, user }: PostFeedProps) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);

    const lastPostRef = useRef<HTMLDivElement>(null)

    const { isIntersecting, ref } = useIntersectionObserver({
        root: lastPostRef.current,
        threshold: 0.5
    })

    React.useEffect(() => {
        const fetchPosts = async () => {
            const res = await getPosts(page);
            console.log(res.data)
            setPosts(oldPosts => [...oldPosts, ...res.data])
            if (isIntersecting) {
                console.log('intersecting')
            } else {
                console.log('not intersecting');
            }
        };

        fetchPosts();
    }, [isIntersecting]);

    return (
        <div>
            <ul className='flex flex-col col-span-2 space-y-6'>
                {
                    posts?.map((post, index) => {
                        const voteAmnt = post.votes.reduce((acc, vote) => {
                            if (vote.type === "UP") return acc + 1
                            if (vote.type === "DOWN") return acc - 1
                            return acc
                        }, 0)

                        const currentVote = post.votes.find(vote => vote.userId === user.id)

                        if (index === posts.length - 1) {
                            return (
                                <li key={post.id} ref={ref}>
                                    <PostCard post={post} voteAmnt={voteAmnt} currentVote={currentVote} />
                                </li>
                            )
                        } else {
                            return (
                                <li key={post.id}>
                                    <PostCard post={post} voteAmnt={voteAmnt} currentVote={currentVote} />
                                </li>
                            )
                        }
                    })
                }
            </ul>
        </div>
    )
}

export default PostFeed 