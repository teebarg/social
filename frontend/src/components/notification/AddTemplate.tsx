import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, Label } from "@/components/ui/label"
import useCustomToast from "@/hooks/useCustomToast"

import type { NotificationTemplateCreate } from "@/client/models/notification.model"
import { NotificationsService } from "@/client/services/notification.service"
import type { ApiError } from "../../client/core/ApiError"
import { handleError, isEmpty } from "../../utils"
import { Modal } from "../modal"

import { Textarea } from "@/components/ui/textarea"

interface AddTemplateProps {
  isOpen: boolean
  onClose: () => void
}

interface Form extends NotificationTemplateCreate {}

const AddTemplate = ({ isOpen, onClose }: AddTemplateProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Form>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      icon: "",
      title: "",
      body: "",
      excerpt: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: NotificationTemplateCreate) =>
      NotificationsService.createTemplate({ requestBody: data }),
    onSuccess: () => {
      showToast.success("Success!", "Template created successfully.")
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
  })

  const onSubmit: SubmitHandler<Form> = (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      {isOpen && (
        <Modal onClose={onClose}>
          <div className="mx-auto w-full p-8">
            <div>
              <h2 className="text-lg font-semibold leading-6 text-default-800">
                Create Template
              </h2>
              <form className="w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
                <FormControl className="mt-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    {...register("title", {
                      required: "Title is required.",
                    })}
                    error={errors.title?.message}
                    className="mt-1 shadow-sm sm:text-sm"
                    placeholder="Notification Title"
                  />
                </FormControl>
                <FormControl className="mt-1">
                  <Label htmlFor="title">Excerpt</Label>
                  <Input
                    type="text"
                    id="excerpt"
                    {...register("excerpt", {
                      required: "Excerpt is required.",
                    })}
                    error={errors.excerpt?.message}
                    className="mt-1 shadow-sm sm:text-sm"
                    placeholder="Excerpt"
                  />
                </FormControl>
                <FormControl className="mt-1">
                  <Label htmlFor="icon">Icon (emoji or URL)</Label>
                  <Input
                    type="text"
                    id="icon"
                    {...register("icon")}
                    className="mt-1"
                    placeholder="🔔"
                  />
                </FormControl>

                <FormControl className="mt-1">
                  <Label htmlFor="body">Message</Label>
                  <Textarea
                    id="body"
                    {...register("body", {
                      required: "Message is required.",
                    })}
                    error={errors.body?.message}
                    className="mt-1"
                    placeholder="Notification message..."
                  />
                </FormControl>

                <div className="flex justify-end gap-2 mt-8">
                  <Button
                    color="danger"
                    className="min-w-32 "
                    onClick={onClose}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="min-w-32"
                    color="primary"
                    type="submit"
                    disabled={
                      !isEmpty(errors) || !isDirty || mutation.isPending
                    }
                    isLoading={mutation.isPending}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default AddTemplate
