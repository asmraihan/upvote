"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import TextareaAutoSize from 'react-textarea-autosize'
import { useForm } from 'react-hook-form'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { zodResolver } from '@hookform/resolvers/zod'
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'

const Editor = () => {

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

    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMounted(true)
        }
    }, [])

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
                                    // upload to uploadthing
                                    const files = [file]; // an array of File objects
                                    const endpoint = 'imageUploader'; // the endpoint to upload files
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
        const init = async () => {
            await initEditor()
            setTimeout(() => {
                // set focus to the editor
            })
        }
        if (isMounted) {
            init()
            return () => { }
        }
    }, [isMounted, initEditor])

    return (
        <div className='w-full  p-4 bg-zinc-50 rounded-lg border border-zinc-200'>
            <form id="post-form" className='w-fit' onSubmit={() => { }}>
                <div className='prose prose-stone dark:prose-invert'>
                    <TextareaAutoSize placeholder='Title' className='w-full resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none' />
                    <div id="editor" className='min-h-[500px]' />
                </div>
            </form>
        </div>
    )
}

export default Editor