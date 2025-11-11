'use client'

import React, { useState } from "react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import MDEditor from "@uiw/react-md-editor"
import { Button } from "./ui/button"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { formSchema } from "@/lib/validation"
import { updatePitch } from "@/lib/actions"

type EditFormProps = {
  post: {
    _id: string
    title: string
    description: string
    category: string
    image: string
    pitch: string
  }
}

export default function EditStartupForm({ post }: EditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pitch, setPitch] = useState(post.pitch)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    try {
      const result = await updatePitch(post._id, formData, pitch)

      if (result.status === "SUCCESS") {
        toast({ title: "Updated!", description: "Startup updated successfully." })
        router.push(`/startup/${post._id}`)
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Error", description: "Unexpected error", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="startup-form">
      <div>
        <label className="startup-form_label">Title</label>
        <Input name="title" defaultValue={post.title} className="startup-form_input" />
      </div>

      <div>
        <label className="startup-form_label">Description</label>
        <Textarea name="description" defaultValue={post.description} className="startup-form_textarea" />
      </div>

      <div>
        <label className="startup-form_label">Category</label>
        <Input name="category" defaultValue={post.category} className="startup-form_input" />
      </div>

      <div>
        <label className="startup-form_label">Image URL</label>
        <Input name="link" defaultValue={post.image} className="startup-form_input" />
      </div>

      <div data-color-mode="light">
        <label className="startup-form_label">Pitch</label>
        <MDEditor
          value={pitch}
          onChange={(v) => setPitch(v || "")}
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
        />
      </div>

      <Button type="submit" className="startup-form_btn text-white-100" disabled={loading}>
        {loading ? "Updating..." : "Update Startup"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  )
}
