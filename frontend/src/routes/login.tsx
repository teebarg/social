import { Link, createFileRoute, redirect } from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl } from "@/components/ui/label"
import { EyeFilled, EyeSlashFilled } from "nui-react-icons"
import { useState } from "react"
import type { Body_login_login_access_token as AccessToken } from "../client"
import useAuth, { isLoggedIn } from "../hooks/useAuth"
import { emailPattern } from "../utils"

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function Login() {
  const [show, setShow] = useState<boolean>(false)
  const { loginMutation, error, resetError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return

    resetError()

    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // error is handled by useAuth hook
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-default-50 to-primary-100 p-6 min-h-screen">
        <div className="max-w-md w-full bg-content1 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
          <h2 className="text-3xl font-semibold text-default-800 mb-2 text-center">
            Login
          </h2>

          <p className="text-default-600 mb-6 text-center">
            login to start your data journey.
          </p>

          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="username">
              <Input
                id="username"
                {...register("username", {
                  required: "Email is required",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
                required
                error={errors.username?.message}
              />
            </FormControl>

            <FormControl id="password">
              <Input
                {...register("password", {
                  required: "Password is required",
                })}
                type={show ? "text" : "password"}
                placeholder="Password"
                required
                endContent={
                  <button
                    type="button"
                    className="text-default-500"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? (
                      <EyeSlashFilled className="h-6 w-6" />
                    ) : (
                      <EyeFilled className="h-6 w-6" />
                    )}
                  </button>
                }
                error={error}
              />
            </FormControl>
            <Link to="/recover-password" className="text-blue-500 text-xs">
              Forgot password?
            </Link>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Log In
            </Button>
          </form>
          <p className="mt-6 text-xs text-default-500 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
