"use client"
import { Comment, CommentVote, VoteType } from '@prisma/client'
import Image from 'next/image'
import React, { useRef, useState, useTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTimeToNow } from '@/lib/utils'
import VoteComment from './VoteComment'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { useRouter } from "next/navigation";
import { useSession } from '@/lib/providers/SessionProvider'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CommentType } from '@/lib/validators/comment'
import { createComment } from '@/lib/actions/comment.actions'
import { toast } from '@/components/ui/use-toast'
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
  currentVote: VoteType | null
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

  const { user } = useSession()
  const router = useRouter()
  const commentRef = useRef<HTMLDivElement>(null)

  const [isReplying, setIsReplying] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  async function submitComment(data: CommentType) {

    const payload: CommentType = {
      postId: data.postId,
      text: data.text,
      replyToId: data.replyToId
    }

    console.log(payload, 'payload')
    startTransition(async () => {
      const res = await createComment(payload);
      console.log(res)
      if (res.error) {
        toast({
          variant: "destructive",
          description: res.error,
        });
      } else if (res.success) {
        toast({
          variant: "default",
          description: "Comment Submitted Successfully",
        });
        console.log("Submission  successful, should redirect to home page");
        router.refresh()
        setInput('')
        setIsReplying(false)
      }
    });
  }

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
      <div className='flex gap-2 items-center flex-wrap'>
        <VoteComment
          commentId={comment.id}
          initialVote={currentVote}
          initialVoteCount={voteCount} />
        <Button
          size='sm'
          variant='ghost'
          aria-label='reply'
          onClick={() => {
            if (!user) router.push('/signin')
            setIsReplying(!isReplying)
          }}
        >
          <MessageSquare className='size-5 text-zinc-700 dark:text-white' />
        </Button>

        {
          isReplying ? (
            <div className='grid w-full gap-1.5'>
              <Label>
                Reply to @{comment.author.username}
              </Label>
              <div className='grid w-full gap-1.5'>
                <div className='mt-2'>
                  <Textarea
                    id='comment'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder='What are your thoughts?'
                  />

                  <div className='mt-2 flex justify-end gap-2'>
                    <Button
                    tabIndex={-1}
                    variant={'outline'}
                    onClick={() => setIsReplying(false)}>
                      Cancel
                    </Button>
                    <Button
                      // isLoading={isPending}
                      disabled={input.length === 0}
                      onClick={() => {
                        if (!input) return
                        submitComment({ postId, text: input, replyToId: comment.replyToId ?? comment.id })
                      }}>
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        }
      </div>
    </div>
  )
}

export default PostComment