import {z} from 'zod'

// PostVoteValidator
export const PostVoteValidator = z.object({
    postId: z.string(),
    type: z.enum(['UP', 'DOWN'])
})

export type PostVoteRequest = z.infer<typeof PostVoteValidator>

// CommentVoteValidator
export const CommentVoteValidator = z.object({
    commentId: z.string(),
    type: z.enum(['UP', 'DOWN'])
})

export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>

