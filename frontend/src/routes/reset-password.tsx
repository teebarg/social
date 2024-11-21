import { useMutation } from "@tanstack/react-query"
import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, Label } from "@/components/ui/label"
import { isLoggedIn } from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { type ApiError, LoginService, type NewPassword } from "../client"
import { confirmPasswordRules, handleError, passwordRules } from "../utils"

interface NewPasswordForm extends NewPassword {
  confirm_password: string
}

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function ResetPassword() {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm<NewPasswordForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      new_password: "",
    },
  })
  const showToast = useCustomToast()
  const navigate = useNavigate()

  const resetPassword = async (data: NewPassword) => {
    const token = new URLSearchParams(window.location.search).get("token")
    if (!token) return
    await LoginService.resetPassword({
      requestBody: { new_password: data.new_password, token: token },
    })
  }

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      showToast.success("Success!", "Password updated successfully.")
      reset()
      navigate({ to: "/login" })
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
  })

  const onSubmit: SubmitHandler<NewPasswordForm> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
            Reset Password
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Please enter your new password and confirm it to reset your
            password..
          </p>

          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <Label required htmlFor="password">
                Set Password
              </Label>
              <Input
                id="password"
                {...register("new_password", passwordRules())}
                placeholder="Password"
                type="password"
                error={errors?.new_password?.message}
              />
            </FormControl>
            <FormControl>
              <Label required htmlFor="password">
                Confirm Password
              </Label>
              <Input
                id="confirm_password"
                {...register(
                  "confirm_password",
                  confirmPasswordRules(getValues),
                )}
                placeholder="Password"
                type="password"
                error={errors?.confirm_password?.message}
              />
            </FormControl>
            <Button
              className="mt-4"
              color="primary"
              type="submit"
              isLoading={mutation.isPending}
              disabled={!isDirty || mutation.isPending}
            >
              Reset Password
            </Button>
          </form>
          <p className="mt-6 text-xs text-gray-500 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
