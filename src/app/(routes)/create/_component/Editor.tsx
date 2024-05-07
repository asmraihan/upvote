"use client"
import React, { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import TextareaAutoSize from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { zodResolver } from '@hookform/resolvers/zod'
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'
import '@/styles/editor.css'
import { useRouter } from 'next/navigation'
import { toast } from "@/components/ui/use-toast";
import { createPost } from '@/lib/actions/post.actions'
import { UserType } from '@/lib/types'

const Editor = ({ user }: { user: UserType | null  }) => {
    console.log(user)
    const router = useRouter();
    console.log(user?.id)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PostCreationRequest>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            title: '',
            content: null
        }
    })

    const ref = useRef<EditorJS>()
    const titleRef = useRef<HTMLTextAreaElement>(null)

    const [isMounted, setIsMounted] = useState<boolean>(false)

    const initEditor = useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        /* @ts-ignore */
        const Embed = (await import('@editorjs/embed')).default
        /* @ts-ignore */
        const Table = (await import('@editorjs/table')).default
        /* @ts-ignore */
        const List = (await import('@editorjs/list')).default
        /* @ts-ignore */
        const Code = (await import('@editorjs/code')).default
        /* @ts-ignore */
        const LinkTool = (await import('@editorjs/link')).default
        /* @ts-ignore */
        const InlineCode = (await import('@editorjs/inline-code')).default
        /* @ts-ignore */
        const ImageTool = (await import('@editorjs/image')).default

        if (!ref.current) {
            const editor = new EditorJS({
                holder: 'editor',
                onReady() {
                    ref.current = editor
                },
                placeholder: 'Start writing your post...',
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link',
                        }
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    const files = [file];
                                    const endpoint = 'imageUploader';
                                    const res = await uploadFiles(endpoint, { files });
                                    console.log(res, 'res upload after')
                                    return {
                                        success: 1,
                                        file: {
                                            url: res[0].url,
                                        },
                                    }
                                },
                            },
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed
                }
            })
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMounted(true)
        }
    }, [])


    useEffect(() => {
        if (Object.keys(errors).length) {
            for (const [_key, value] of Object.entries(errors)) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: JSON.stringify(value),
                });
            }
        }
    }, [errors]);

    useEffect(() => {
        const init = async () => {
            await initEditor()
            setTimeout(() => {
                // set focus to the editor
                titleRef.current?.focus()
            }, 0)
        }
        if (isMounted) {
            init()
            // cleanup
            return () => {
                ref.current?.destroy()
                ref.current = undefined
            }
        }
    }, [isMounted, initEditor])


    const [isPending, startTransition] = useTransition()

    async function onSubmit(data: PostCreationRequest) {
        
        const blocks = await ref.current?.save()
        const payload: PostCreationRequest = {
            title: data.title,
            content: blocks,
            authorId: user?.id!
        }
        console.log(payload, 'payload')
        startTransition(async () => {
            const res = await createPost(payload);
            console.log(res)
            if (res.error) {
                toast({
                    variant: "destructive",
                    description: res.error,
                });
            } else if (res.success) {
                toast({
                    variant: "default",
                    description: "Post Submission was successful",
                });
                console.log("Submission  successful, should redirect to home page");
                router.push("/");
            }
        });
    }

    const { ref: _titleRef, ...rest } = register('title')

    return (
        <div className='w-full  p-4 bg-zinc-50 dark:bg-neutral-950 rounded-lg border border-zinc-200 dark:border-neutral-800'>
            <form id="post-form" className='w-fit' onSubmit={handleSubmit((e) => { onSubmit(e) })}>
                <div className='prose prose-stone dark:prose-invert'>
                    <TextareaAutoSize
                        ref={(e) => {
                            _titleRef(e)
                            // @ts-ignore
                            titleRef.current = e
                        }}
                        {...rest}
                        placeholder='Title' className='w-full resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none' />
                    <div id="editor" className='min-h-[500px]' />
                </div>
            </form>
        </div>
    )
}

export default Editor