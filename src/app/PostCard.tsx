import React from 'react'

const PostCard = ({ post }) => {
  console.log(post)
  return (
    <div className='h-52 bg-sky-100 dark:bg-zinc-900 rounded-2xl'>
      <h1>{post.title}</h1>
    </div>
  )
}

export default PostCard