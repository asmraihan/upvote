import { z } from 'zod';

export const CommentValidator = z.object({
    postId: z.string(),
    text: z.string(),
    replyToId: z.string().optional(),
});


export type CommentType = z.infer<typeof CommentValidator>;