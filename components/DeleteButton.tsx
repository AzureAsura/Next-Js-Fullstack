'use client'
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { deletePitch } from "@/lib/actions"
import { Delete, Trash, Trash2Icon } from "lucide-react"

type Props = { id: string }

const DeleteButton = ({ id }: Props) => {

    const router = useRouter()

    const handleDelete = async (_prevstate: any, formData: FormData) => {
        const res = await deletePitch(id)
        return res
    }

    const [state, formAction, isPending] = useActionState(handleDelete, {
        error: '',
        status: 'INITIAL'
    })

    const onClick = async () => {
        if (!confirm('Are you sure you want to delete this startup?')) return
        const res = await deletePitch(id)
        if (res.status === 'SUCCESS') {
            router.push('/')
        } else {
            alert('Delete failed: ' + (res.error || 'unknown'))
        }
    }



    return (
        <div>
            <button
                onClick={onClick}
                disabled={isPending}
                className="btn btn-danger"
            >
                {isPending ? 'Deleting...' : (
                    <div>
                        <Trash2Icon className="text-red-500"/>
                    </div>
                )}
            </button>
        </div>
    )
}

export default DeleteButton