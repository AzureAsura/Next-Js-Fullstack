import { STARTUP_BY_ID_QUERY } from '@/lib/queris'
import { formatDate } from '@/lib/utils'
import { client } from '@/sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import markdownit from 'markdown-it'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import View from '@/components/View'
import DeleteButton from '@/components/DeleteButton'
import { auth } from '@/auth'
import { Edit2Icon } from 'lucide-react'

const md = markdownit()

const page = async ({ params }: { params: Promise<{ id: string }> }) => {

    const session = await auth()


    const id = (await params).id

    const post = await client.fetch(STARTUP_BY_ID_QUERY, { id })

    if (!post) return notFound()



    const parsedContent = md.render(post?.pitch || '')

    return (
        <div>
            <div className="relative !min-h-[230px] flex flex-col items-center justify-center text-center px-6 py-10">
                <img
                    src="/container2.jpg"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-black/40 z-[1]" />

                <div className="relative z-[2] text-white">
                    <p className="tag">{formatDate(post?._createdAt)}</p>
                    <h1 className="heading">{post.title}</h1>
                    <p className="sub-heading !max-w-5xl">{post.description}</p>
                </div>
            </div>



            <div className='section_container'>
                <img src={post.image} alt={post.title} className='w-full h-auto rounded-xl ' />

                {session?.id === post?.author?._id ? (
                    <div className="flex gap-3 mt-8 justify-end">
                        <Link
                            href={`/startup/${post._id}/edit`}
                            className=""
                        >
                            <Edit2Icon />
                        </Link>
                        <DeleteButton id={post._id} />
                    </div>
                ) : null}

                <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
                    <div className='flex-between gap-5'>
                        <Link href={`/user/${post.author?._id}`} className='flex gap-2 items-center mb-3'>
                            <Image
                                src={post.author.image}
                                alt='profile picture'
                                width={64}
                                height={64}
                                className='rounded-full drop-shadow-lg'
                            />

                            <div>
                                <p className='text-20-medium'>{post.author.name}</p>
                                <p className='text-16-medium !text-black-300'>@{post.author.username}</p>
                            </div>
                        </Link>

                        <p className='category-tag'>{post.category}</p>
                    </div>

                    <h3 className='text-30-bold'>Pitch Details</h3>
                    {parsedContent ? (
                        <article dangerouslySetInnerHTML={{ __html: parsedContent }} className='prose max-w-4xl font-work-sans break-all' />
                    ) : (
                        <p className='no-result'>No details provided</p>
                    )}
                </div>

                <hr className='divider' />

                <Suspense fallback={<Skeleton className='view_skeleton' />}>
                    <View id={id} />
                </Suspense>
            </div>

        </div>
    )
}

export default page