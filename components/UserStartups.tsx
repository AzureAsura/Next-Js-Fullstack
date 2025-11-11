import React from 'react'
import { STARTUPS_BY_AUTHOR_QUERY } from '@/lib/queris'
import { client } from '@/sanity/lib/client'
import StartupCard, { StartupTypeCard } from './StartupCard'

const UserStartups = async ({ id }: { id: string }) => {

    const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id })

    return (
        <div>
            {startups.length > 0 ? (
                startups.map((startup: StartupTypeCard) => (
                    <StartupCard key={startup._id} post={startup} />
                ))
            ) : (
                <p className="no-result">No post yet</p>
            )}

        </div>
    )
}

export default UserStartups