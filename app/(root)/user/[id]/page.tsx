import { auth } from '@/auth'
import UserStartups from '@/components/UserStartups'
import { AUTHOR_BY_ID_QUERY } from '@/lib/queris'
import { client } from '@/sanity/lib/client'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {

    const id = (await params).id

    const session = await auth()

    const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id })
    if (!user) {
        return notFound()
    }

    return (
        <div className='profile_container'>
            <div className='profile_card'>
                <div className='profile_title'>
                    <h3 className='text-24-black uppercase text-center'>
                        {user.name}
                    </h3>
                </div>

                <Image
                    src={user.image}
                    alt={user.name}
                    height={220}
                    width={220}
                    className='profile_image'
                />

                <p className='text-30-extrabold mt-7 text-center'>
                    @{user?.name}
                </p>
                <p className='mt-1 text-center text-14-normal'>
                    {user?.bio}
                </p>

            </div>

            <div className='flex-1 flex flex-col gap-5 lg:-mt-5'>
                <p className='text-30-bold'>
                    {session?.id == id ? 'Your' : 'All'} Startups
                </p>
                <ul className="grid sm:grid-cols-2 gap-5">
                    <Suspense fallback={<p>Loading startups...</p>}>
                        <UserStartups id={id} />
                    </Suspense>
                </ul>
            </div>

        </div>
    )
}

export default page 