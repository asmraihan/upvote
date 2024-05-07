import { prisma } from "@/lib/prismaClient";

export async function GET(req: Request) {
  const url = new URL(req.url)
  try {
    const limit = url.searchParams.get('limit') || "3"
    const page = url.searchParams.get('page') || "1"

    const posts = await prisma.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
        include: {
        votes: true,
        comments: true,
        author: true
      },
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response('Could not fetch posts', { status: 500 })
  }
}