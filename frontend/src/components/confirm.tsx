import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"

import type { ApiError } from "@/client"
import { Button } from "@/components/ui/button"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

interface Props {
  title?: string
  content?: string
  onConfirm: any
  queryKey?: string
  onClose?: () => void
}

const Confirm: React.FC<Props> = ({
  title = "Confirm?",
  content = "Are you sure you want to delete this item? This action cannot be undone.",
  onConfirm,
  queryKey,
  onClose,
}) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const mutation = useMutation({
    mutationFn: () => onConfirm,
    onSuccess: () => {
      showToast.success(
        "Success",
        "Your account has been successfully deleted.",
      )
      onClose?.()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })

  const onSubmit = async () => {
    mutation.mutate()
  }

  return (
    <React.Fragment>
      <div className="mx-auto w-full p-8">
        <div>
          <div className="pb-4 flex items-center justify-between border-b border-black/10 dark:border-white/10">
            <div className="flex">
              <div className="flex items-center">
                <div className="flex grow flex-col gap-1">
                  <h2 className="text-lg font-semibold leading-6 text-default-800">
                    {title}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-default-500 mt-6">{content}</p>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <Button
              className="min-w-32"
              color="default"
              variant="shadow"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="min-w-32"
              color="danger"
              variant="shadow"
              onClick={onSubmit}
              disabled={mutation.isPending}
              isLoading={mutation.isPending}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export { Confirm }
