import { Container } from '@/components/shared/container'
import { buttonVariants } from '@/components/ui/button'
import { prisma } from '@/lib/prismaClient'
import { redis } from '@/lib/redis.config'
import { CachedPostType } from '@/lib/types'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import PostVoteServer from './_component/PostVoteServer'
import { formatTimeToNow } from '@/lib/utils'
import RenderBlock from '@/app/_component/RenderBlock'
import CommentSection from './_component/CommentSection'

interface PageProps {
    params: {
        postId: string
    }
}

// export const dynamic = "force-dynamic"
// export const fetchCache = "force-no-store"
export const revalidate = 0 // disable cache

const page = async ({ params }: PageProps) => {

    const cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPostType

    let post: (Post & { votes: Vote[]; author: User }) | null = null

    if (!cachedPost) {
        post = await prisma.post.findUnique({
            where: {
                id: params.postId
            },
            include: {
                votes: true,
                author: true
            }
        })
    }

    console.log(cachedPost)
    console.log(post)

    if (!post && !cachedPost) return notFound()

 

    return (
        <Container className="mt-4 lg:mt-6">
   
            <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
                <Suspense fallback={<PostVoteShell />}>
                    <PostVoteServer
                        postId={post?.id ?? cachedPost.id}
                        getData={async () => {
                            return await prisma.post.findUnique({
                                where: {
                                    id: params.postId
                                },
                                include: {
                                    votes: true,
                                }
                            })
                        }}
                    />
                </Suspense>

                <div className='sm:w-0 w-full flex-1 bg-white p-4 rounded-sm'>
                    <p className='max-h-40 mt-1 truncate text-xs text-gray-500'>
                        Posted by • {post?.author.username ?? cachedPost.authorUsername}{' '}
                        {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
                    </p>
                    <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
                        {post?.title ?? cachedPost.title}
                    </h1>

                {/* editor output */}
                    <RenderBlock content={post?.content ?? cachedPost.content} />

                    <Suspense
                        fallback={
                            <Loader2 className='h-5 w-5 animate-spin text-zinc-500' />
                        }>
                        <CommentSection postId={post?.id ?? cachedPost.id} />
                    </Suspense>
                </div>

            </div>
        </Container>
    )
}

const PostVoteShell = () => {
    return (
        <div className='flex items-center flex-col pr-6 w-20'>
            {/* upvote */}
            <div className={buttonVariants({ variant: 'ghost' })}>
                <ArrowBigUp className='size-6 text-zinc-700' />
            </div>

            {/* score */}
            <div className='text-center py-2 font-medium text-sm text-zinc-900'>
                <Loader2 className='h-3 w-3 animate-spin' />
            </div>

            {/* downvote */}
            <div className={buttonVariants({ variant: 'ghost' })}>
                <ArrowBigDown className='size-6 text-zinc-700' />
            </div>
        </div>
    )
}

export default page