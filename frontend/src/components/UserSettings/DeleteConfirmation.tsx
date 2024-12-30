import { useMutation, useQueryClient } from "@tanstack/react-query"

import { type ApiError, UsersService } from "@/client"
import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

interface DeleteProps {
  onClose: () => void
}

const DeleteConfirmation = ({ onClose }: DeleteProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const { logout } = useAuth()

  const mutation = useMutation({
    mutationFn: () => UsersService.deleteUserMe(),
    onSuccess: () => {
      showToast.success(
        "Success",
        "Your account has been successfully deleted.",
      )
      logout()
      onClose()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    },
  })

  const onSubmit = async () => {
    mutation.mutate()
  }

  return (
    <>
      <div className="mx-auto w-full p-8">
        <div>
          <div className="pb-4 flex items-center justify-between border-b border-black/10 dark:border-white/10">
            <div className="flex">
              <div className="flex items-center">
                <div className="flex grow flex-col gap-1">
                  <h2 className="text-lg font-semibold leading-6 text-default-800">
                    Confirmation Required
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-default-500 mt-6">
              All your account data will be{" "}
              <strong>permanently deleted.</strong> If you are sure, please
              click <strong>"Confirm"</strong> to proceed. This action cannot be
              undone.
            </p>
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
    </>
  )
}

export default DeleteConfirmation
