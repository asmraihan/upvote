import { title } from 'process';
import { z } from 'zod';

export const PostValidator = z.object({
    title: z
        .string()
        .min(3, { message: 'Title must be longer than 3 characters' })
        .max(100, { message: 'Title must be at least 100 characters' }),

    content: z
        .any()
})  

export type PostCreationRequest = z.infer<typeof PostValidator>