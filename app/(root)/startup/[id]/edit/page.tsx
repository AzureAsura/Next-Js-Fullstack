import { client } from "@/sanity/lib/client"
import { STARTUP_BY_ID_QUERY } from "@/lib/queris"
import EditStartupForm from "@/components/EditStartupForm"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import Image from "next/image"

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const post = await client.fetch(STARTUP_BY_ID_QUERY, { id })

    const session = await auth()

    if (!session) redirect('/')

    if (!post) return notFound()

    return (
        <div>
            <div className="relative w-full min-h-[230px] flex flex-col justify-center items-center py-10 px-6 overflow-hidden">
                <Image
                    src="/container2.jpg"
                    alt="Background"
                    fill
                    priority
                    className="object-cover object-center -z-10"
                />

                <div className="absolute inset-0 bg-black/50 -z-10" />

                <h1 className="heading text-white relative z-10">
                    Edit your startup
                </h1>
            </div>

            <EditStartupForm post={post} />
        </div>


    )
}
