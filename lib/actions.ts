'use server'

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils"
import slugify from 'slugify'
import { writeClient } from "@/sanity/lib/write-client"
import { DELETE_PITCH_BY_ID, UPDATE_PITCH_BY_ID } from "./queris"
import { formSchema } from "./validation"

export const createPitch = async (
    state: any,
    form: FormData,
    pitch: string,
) => {
    const session = await auth()

    if (!session) return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })

    const { title, description, category, link } = Object.fromEntries(Array.from(form).filter(([key]) => key !== 'pitch'))

    const slug = slugify(title as string, { lower: true, strict: true })

    try {
        const startup = {
            title,
            description,
            category,
            image: link,
            slug: {
                _type: slug,
                current: slug
            },
            author: {
                _type: 'reference',
                _ref: session?.id
            },
            pitch
        }

        const result = await writeClient.create({ _type: 'startup', ...startup })

        return parseServerActionResponse({
            ...result,
            error: '',
            status: 'SUCCESS'
        })
    } catch (error) {

    }

}

export const deletePitch = async (id: string) => {
    const session = await auth()
    if (!session) {
        return parseServerActionResponse({ error: "Not signed in", status: "ERROR" })
    }

    try {
        const pitch = await writeClient.fetch(DELETE_PITCH_BY_ID, { id })

        if (!pitch) {
            return parseServerActionResponse({ error: "Pitch not found", status: "ERROR" })
        }

        if (pitch.authorId !== session.id) {
            return parseServerActionResponse({ error: "Not authorized", status: "ERROR" })
        }

        await writeClient.delete(id)

        return parseServerActionResponse({ status: "SUCCESS", error: "" })

    } catch (err: any) {
        return parseServerActionResponse({ error: err?.message || String(err), status: "ERROR" })
    }
}

export const updatePitch = async (
    id: string,
    formData: FormData,
    pitch: string
) => {
    const session = await auth()
    if (!session) {
        return parseServerActionResponse({ error: 'Not signed in', status: 'ERROR' })
    }

    try {
        const { title, description, category, link } = Object.fromEntries(formData)

        await formSchema.parseAsync({ title, description, category, link, pitch })

        const existing = await writeClient.fetch(UPDATE_PITCH_BY_ID, { id })


        if (!existing) {
            return parseServerActionResponse({ error: 'Not found', status: 'ERROR' })
        }

        if (existing.authorId !== session.id) {
            return parseServerActionResponse({ error: 'Not authorized', status: 'ERROR' })
        }

        const updated = await writeClient
            .patch(id)
            .set({
                title,
                description,
                category,
                image: link,
                pitch,
            })
            .commit()

        return parseServerActionResponse({ ...updated, error: '', status: 'SUCCESS' })

    } catch (error: any) {
        return parseServerActionResponse({ error: error.message, status: 'ERROR' })
    }
}