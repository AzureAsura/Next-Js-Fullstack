import { auth } from '@/auth'
import StartupForm from '@/components/StartupForm'
import { redirect } from 'next/navigation'
import React from 'react'
import Image from 'next/image'

const page = async () => {
    const session = await auth()

    if (!session) redirect('/')
    return (
        <div>
            <div className="relative w-full min-h-[230px] flex flex-col justify-center items-center py-10 px-6 overflow-hidden">
                <img
                    src="/container2.jpg"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover object-center -z-10"
                />

                <div className="absolute inset-0 bg-black/50 -z-10" />

                <h1 className="heading text-white relative z-10">
                    Submit your startup
                </h1>
            </div>
            <StartupForm />
        </div>

    )
}

export default page