import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import useCustomToast from "@/hooks/useCustomToast"
import { ItemsService, UsersService } from "../../client"

interface DeleteProps {
  type: string
  id: string
  isOpen?: boolean
  onClose: () => void
}

const Delete = ({ type, id, onClose }: DeleteProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const deleteEntity = async (id: string) => {
    if (type === "Item") {
      await ItemsService.deleteItem({ id: id })
    } else if (type === "User") {
      await UsersService.deleteUser({ userId: id })
    } else {
      throw new Error(`Unexpected type: ${type}`)
    }
  }

  const mutation = useMutation({
    mutationFn: deleteEntity,
    onSuccess: () => {
      showToast.success(
        "Success",
        `The ${type.toLowerCase()} was deleted successfully.`,
      )
      onClose()
    },
    onError: () => {
      showToast.error(
        "An error occurred.",
        `An error occurred while deleting the ${type.toLowerCase()}.`,
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [type === "Item" ? "items" : "users"],
      })
    },
  })

  const onSubmit = async () => {
    mutation.mutate(id)
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
                    Delete {type}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-default-500 mt-6">
              {type === "User" && (
                <span>
                  All items associated with this user will also be{" "}
                  <strong>permantly deleted. </strong>
                </span>
              )}
              Are you sure? You will not be able to undo this action.
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
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Delete
