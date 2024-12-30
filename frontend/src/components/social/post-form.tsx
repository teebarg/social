import { type ApiError, type DraftCreate, DraftService } from "@/client"
import type { SocialPlatform } from "@/client/models"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/datepicker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Calendar, FacebookIcon, TwitterIcon } from "nui-react-icons"
import type React from "react"
import { useState } from "react"

type Props = {}

const CreatePost: React.FC<Props> = () => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(
    [],
  )
  const [scheduledFor, setScheduledFor] = useState<Date>()
  const [isScheduling, setIsScheduling] = useState(false)

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    )
  }

  const mutation = useMutation({
    mutationFn: (data: DraftCreate) =>
      DraftService.create({ requestBody: data }),
    onSuccess: () => {
      showToast.success("Success!", "Draft created successfully.")
      setContent("")
      setTitle("")
      setScheduledFor(undefined)
      setIsScheduling(false)
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries()
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
    <div className="bg-content1 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-default-800 mb-4">
        Create Post
      </h2>
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
          className="w-full h-32 p-4 border border-default-200 rounded-lg focus:ring-1 focus:ring-blue-50 focus:border-transparent resize-none"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={() => togglePlatform("facebook")}
            className={`p-2 rounded-full transition-colors ${
              selectedPlatforms.includes("facebook")
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-default-100 text-default-600"
            }`}
          >
            <FacebookIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => togglePlatform("twitter")}
            className={`p-2 rounded-full transition-colors ${
              selectedPlatforms.includes("twitter")
                ? "bg-blue-100 text-blue-400"
                : "hover:bg-default-100 text-default-600"
            }`}
          >
            <TwitterIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setIsScheduling(!isScheduling)}
              className={`p-2 rounded-full transition-colors ${
                isScheduling
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-default-100 text-default-600"
              }`}
            >
              <Calendar className="w-6 h-6" />
            </button>
            {/* <button className="p-2 hover:bg-default-100 text-default-600 rounded-full transition-colors">
                            <ImageIcon className="w-6 h-6" />
                        </button> */}
          </div>
        </div>

        {isScheduling && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-default-600">Schedule for:</span>
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
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}

export { CreatePost }
