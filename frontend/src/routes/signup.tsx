import { Link, createFileRoute, redirect } from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, Label } from "@/components/ui/label"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import { confirmPasswordRules, emailPattern, passwordRules } from "@/utils"
import type { UserRegister } from "../client"

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

interface UserRegisterForm extends UserRegister {
  confirm_password: string
}

function SignUp() {
  const { signUpMutation } = useAuth()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
    signUpMutation.mutate(data)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 min-h-screen">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
            SignUp
          </h2>

          <p className="text-gray-600 mb-6 text-center">
            SignUp and let's get you started.
          </p>

          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <Label required htmlFor="first_name">
                First Name
              </Label>
              <Input
                id="first_name"
                minLength={3}
                {...register("first_name", {
                  required: "First Name is required",
                })}
                placeholder="Full Name"
                type="text"
                error={errors.first_name?.message}
              />
            </FormControl>
            <FormControl>
              <Label required htmlFor="last_name">
                Last Name
              </Label>
              <Input
                id="last_name"
                minLength={3}
                {...register("last_name", {
                  required: "Last Name is required",
                })}
                placeholder="Last Name"
                type="text"
                error={errors.last_name?.message}
              />
            </FormControl>
            <FormControl>
              <Label required htmlFor="last_name">
                Email
              </Label>
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
            <FormControl>
              <Label required htmlFor="password">
                Set Password
              </Label>
              <Input
                id="password"
                {...register("password", passwordRules())}
                placeholder="Password"
                type="password"
                error={errors.password?.message}
              />
            </FormControl>
            <FormControl>
              <Label required htmlFor="confirm_password">
                Confirm Password
              </Label>
              <Input
                id="confirm_password"
                {...register(
                  "confirm_password",
                  confirmPasswordRules(getValues),
                )}
                placeholder="Repeat Password"
                type="password"
                error={errors.confirm_password?.message}
              />
            </FormControl>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Sign Up
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

export default SignUp
