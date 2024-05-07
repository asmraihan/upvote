import { getPosts } from '@/lib/fetchers/getPosts'
import PostCard from './PostCard'
import { UserType } from '@/lib/types'
import MoreFeed from './MoreFeed'


const InitialFeed = async ({ user }: { user: UserType | null }) => {
    const postsData = await getPosts(1, 3);
    console.log(postsData)

    return (
        <div>
            <ul className='flex flex-col col-span-6 space-y-6'>
                {
                    postsData.data?.map((post, index) => {
                        const voteCount = post.votes.reduce((acc, vote) => {
                            if (vote.type === "UP") return acc + 1
                            if (vote.type === "DOWN") return acc - 1
                            return acc
                        }, 0)

                        const currentVote = post.votes.find(vote => vote.userId === user?.id)
                        return (
                            <li key={post.id}>
                                <PostCard post={post} voteCount={voteCount} currentVote={currentVote} />
                            </li>
                        )
                    })
                }
            </ul>

            <MoreFeed user={user} />
        </div>
    )
}

export default InitialFeed 