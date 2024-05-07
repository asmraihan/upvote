import React from 'react'


interface PostCardProps {
  post: any; 
  voteCount: number;
  currentVote: any;
}


const PostCard: React.FC<PostCardProps> = ({ post, voteCount, currentVote }) => {



  console.log(post)
  return (
    <div className='h-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border-2 border-gray-500'>
      <h1>{post.title}</h1>
    </div>
  )
}

export default PostCard