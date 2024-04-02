import { Container } from '@/components/shared/container'
import { Button } from '@/components/ui/button'
import React from 'react'
import Editor from './_component/Editor'
import { validateRequest } from '@/lib/lucia/luciaAuth'
import { UserType } from '@/lib/types'

const CreatePostPage = async () => {

    const { user } = await validateRequest();

    return (
        <Container className='mt-4 lg:mt-6'>
            <div className='flex flex-col items-start gap-6'>
                {/* heading */}
                <div className='border-b border-gray-200 pb-5'>
                    <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
                        <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>
                            Create Post
                        </h3>
                        <p className='ml-2 mt-1 truncate text-sm text-gray-500'>
                            in Upvote Forum
                        </p>
                    </div>
                </div>

                {/* form */}

                <div className='w-full flex justify-between  gap-10'>
                <div className='w-3/4'>
                <Editor user={user} />
                </div>
                <div className='w-1/4'>
                    <Button type='submit' className='w-full' form='post-form'>
                        Post
                    </Button>
                </div>
                </div>
            </div>
        </Container>
    )
}

export default CreatePostPage