import { type ApiError, DraftService, type DraftUpdate } from "@/client"
import type { Post } from "@/client/models"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/datepicker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Calendar } from "nui-react-icons"
import type React from "react"
import { useState } from "react"

type Props = {
  post: Post
  onClose: () => void
}

const UpdatePost: React.FC<Props> = ({ post, onClose }) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const [content, setContent] = useState(post.content)
  const [title, setTitle] = useState(post.title)
  const [scheduledFor, setScheduledFor] = useState<Date | undefined>(
    new Date(post.scheduled_time as Date),
  )
  const [isScheduling, setIsScheduling] = useState<boolean>(
    !!post.scheduled_time,
  )

  const mutation = useMutation({
    mutationFn: (data: DraftUpdate) =>
      DraftService.update({ id: post.id, requestBody: data }),
    onSuccess: () => {
      showToast.success("Success!", "Draft updated successfully.")
      setContent("")
      setTitle("")
      setIsScheduling(false)
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts"] })
      onClose()
    },
  })

  const handleSubmit = () => {
    if (!content.trim()) {
      showToast.error("Entity error", "Please check your in inputs")
      return
    }
    mutation.mutate({ title, content, scheduled_time: scheduledFor })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Post</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            id="title"
            name="title"
            className="max-w-sm"
            required
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-50 focus:border-transparent resize-none"
        />

        <div className="flex w-full">
          <button
            onClick={() => setIsScheduling(!isScheduling)}
            className={`p-2 rounded-full transition-colors ml-auto ${
              isScheduling
                ? "bg-purple-100 text-purple-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <Calendar className="w-6 h-6" viewBox="0 0 20 20" />
          </button>
        </div>

        {isScheduling && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Schedule for:</span>
            <DateTimePicker
              value={scheduledFor}
              onChange={setScheduledFor}
              minDate={new Date()}
            />
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
            color="primary"
            onClick={() => handleSubmit()}
            className="px-4 py-2"
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  )
}

export { UpdatePost }
