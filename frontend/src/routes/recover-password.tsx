import { useMutation } from "@tanstack/react-query"
import { Link, createFileRoute, redirect } from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl } from "@/components/ui/label"
import { isLoggedIn } from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { type ApiError, LoginService } from "../client"
import { emailPattern, handleError } from "../utils"

interface FormData {
  email: string
}

export const Route = createFileRoute("/recover-password")({
  component: RecoverPassword,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function RecoverPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>()
  const showToast = useCustomToast()

  const recoverPassword = async (data: FormData) => {
    await LoginService.recoverPassword({
      email: data.email,
    })
  }

  const mutation = useMutation({
    mutationFn: recoverPassword,
    onSuccess: () => {
      showToast.success(
        "Email sent.",
        "We sent an email with a link to get back into your account.",
      )
      reset()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
            Password Recovery
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            A password recovery email will be sent to the registered account.
          </p>

          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <Input
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
                error={errors?.email?.message}
              />
            </FormControl>
            <Button
              className="mt-4"
              color="primary"
              type="submit"
              isLoading={mutation.isPending}
              disabled={!isDirty || mutation.isPending}
            >
              Continue
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
