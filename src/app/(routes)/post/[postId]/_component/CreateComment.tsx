"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { startTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { createComment } from '@/lib/actions/comment.actions'
import { CommentType } from '@/lib/validators/comment'

interface CreateCommentProps {
    postId: string
    replyToId?: string
  }
  

const CreateComment = ({ postId, replyToId } : CreateCommentProps) => {
    const [input, setInput] = useState<string>('')
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()

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
            }
        });
    }


    return (
        <div className='grid w-full gap-1.5'>
            <Label htmlFor='comment'>Your comment</Label>
            <div className='mt-2'>
                <Textarea
                    id='comment'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder='What are your thoughts?'
                />

                <div className='mt-2 flex justify-end'>
                    <Button
                        // isLoading={isPending}
                        disabled={input.length === 0}
                        onClick={() => submitComment({ postId, text: input, replyToId })}>
                        Post
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateComment