'use client'

import { Image as ImageIcon, SquareTerminal  } from 'lucide-react'
import {  useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserType } from '@/lib/types'

const InstantPost = ({ user }: { user: UserType | null }) => {
    const router = useRouter()

    return (
        <div className=' h-full px-6 py-4 flex justify-between rounded-md gap-6 bg-white dark:bg-neutral-900 '>
            <div className='relative'>
                <Image
                    className="object-cover transition-opacity duration-300 rounded-full select-none ring-1 ring-zinc-100/10 hover:opacity-80"
                    src={user?.profilePictureUrl!}
                    alt="avatar"
                    height={48}
                    width={48}
                />
                <span className='absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white' />
            </div>
            <Input
                onClick={() => router.push('/create')}
                readOnly
                placeholder='Create post'
            />
            <Button
                onClick={() => router.push('/create')}
                variant='ghost'>
                <ImageIcon className='text-zinc-600 dark:text-zinc-200' />
            </Button>
            <Button
                onClick={() => router.push('/create')}
                variant='ghost'>
                <SquareTerminal className='text-zinc-600 dark:text-zinc-200' />
            </Button>
        </div>
    )
}

export default InstantPost