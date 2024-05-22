import { getServerSession } from '@/lib/lucia/luciaAuth'
import { prisma } from '@/lib/prismaClient'
import { CommentValidator } from '@/lib/validators/comment'
import { z } from 'zod'

export async function PATCH(req: Request) {
    try {
        const body = await req.json()

        const { postId, text, replyToId } = CommentValidator.parse(body)

        const { user } = await getServerSession();

        if (!user) {
            return new Response('Unauthorized', { status: 401 })
        }

        // if no existing vote, create a new vote
        await prisma.comment.create({
            data: {
                text,
                postId,
                authorId: user.id,
                replyToId,
            },
        })

        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
        }

        return new Response(
            'Could not post to subreddit at this time. Please try later',
            { status: 500 }
        )
    }
}