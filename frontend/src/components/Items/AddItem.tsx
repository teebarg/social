import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useCustomToast from "@/hooks/useCustomToast"
import { type ApiError, type ItemCreate, ItemsService } from "../../client"
import { handleError, isEmpty } from "../../utils"
import { FormControl, Label } from "../ui/label"

interface AddItemProps {
  isOpen: boolean
  onClose: () => void
}

const AddItem = ({ isOpen, onClose }: AddItemProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ItemCreate) =>
      ItemsService.createItem({ requestBody: data }),
    onSuccess: () => {
      showToast.success("Success!", "Item created successfully.")
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })

  const onSubmit: SubmitHandler<ItemCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      {isOpen && (
        <Modal onClose={onClose}>
          <div className="mx-auto w-full p-8">
            <div>
              <h2 className="text-lg font-semibold leading-6 text-default-800">
                Add Item
              </h2>
              <form className="w-full mt-2" onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...register("title", {
                      required: "Title is required.",
                    })}
                    placeholder="Title"
                    type="text"
                    error={errors.title?.message}
                  />
                </FormControl>
                <FormControl className="mt-1">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    {...register("description")}
                    placeholder="Description"
                    type="text"
                    error={errors.description?.message}
                  />
                </FormControl>
                <div className="flex justify-end gap-2 mt-8">
                  <Button
                    className="min-w-32"
                    onClick={onClose}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="min-w-32"
                    color="primary"
                    type="submit"
                    disabled={!isEmpty(errors) || mutation.isPending}
                    isLoading={mutation.isPending}
                  >
                    Confirm
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

export default AddItem
