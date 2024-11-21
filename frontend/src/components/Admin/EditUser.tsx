import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, Label } from "@/components/ui/label"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, handleError, isEmpty } from "@/utils"
import {
  type ApiError,
  type UserPublic,
  type UserUpdate,
  UsersService,
} from "../../client"
import { Modal } from "../modal"

interface EditUserProps {
  user: UserPublic
  isOpen: boolean
  onClose: () => void
}

interface UserUpdateForm extends UserUpdate {
  confirm_password: string
}

const EditUser = ({ user, isOpen, onClose }: EditUserProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UserUpdateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: user,
  })

  const mutation = useMutation({
    mutationFn: (data: UserUpdateForm) =>
      UsersService.updateUser({ userId: user.id, requestBody: data }),
    onSuccess: () => {
      showToast.success("Success!", "User updated successfully.")
      onClose()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const onSubmit: SubmitHandler<UserUpdateForm> = async (data) => {
    if (data.password === "") {
      data.password = undefined
    }
    mutation.mutate(data)
  }

  return (
    <>
      {isOpen && (
        <Modal onClose={onClose}>
          <div className="mx-auto w-full p-8">
            <div>
              <h2 className="text-lg font-semibold leading-6 text-default-800">
                Edit User
              </h2>
              <form className="w-full mt-2" onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: emailPattern,
                    })}
                    placeholder="Email"
                    type="email"
                    error={errors.email?.message}
                  />
                </FormControl>
                <FormControl className="mt-1">
                  <Label htmlFor="first_name">Firstname</Label>
                  <Input
                    id="first_name"
                    {...register("first_name")}
                    type="text"
                    placeholder="John"
                  />
                </FormControl>
                <FormControl className="mt-1">
                  <Label htmlFor="last_name">Lastname</Label>
                  <Input
                    id="last_name"
                    {...register("last_name")}
                    type="text"
                    placeholder="Doe"
                  />
                </FormControl>
                <FormControl className="mt-1">
                  <Label htmlFor="password">Set Password</Label>
                  <Input
                    id="password"
                    {...register("password", {
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    placeholder="Password"
                    type="password"
                  />
                </FormControl>
                <FormControl className="mt-1">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    {...register("confirm_password", {
                      validate: (value) =>
                        value === getValues().password ||
                        "The passwords do not match",
                    })}
                    placeholder="Password"
                    type="password"
                  />
                </FormControl>
                <div>
                  <input
                    id="is_superuser"
                    type="checkbox"
                    {...register("is_superuser")}
                  />
                  <label htmlFor="is_superuser">Is superuser</label>
                </div>
                <div>
                  <input
                    id="is_active"
                    type="checkbox"
                    {...register("is_active")}
                  />
                  <label htmlFor="is_active">Is active</label>
                </div>
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

export default EditUser
