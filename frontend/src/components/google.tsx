import authTap from "auth-tap"
import { useSnackbar } from "notistack"
import { useEffect } from "react"
import useAuth from "../hooks/useAuth"

export default function Google() {
  const { enqueueSnackbar } = useSnackbar()
  const { user, isLoading, googleLoginMutation } = useAuth()
  const options: any = {
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // required
    auto_select: false, // optional
    context: "signin", // optional
  }

  useEffect(() => {
    if (isLoading || user) {
      return
    }
    console.log("got here")
    authTap(options, async (res: any) => {
      try {
        await googleLoginMutation.mutateAsync({
          email: res.email,
          password: "password",
          firstname: res.given_name,
          lastname: res.family_name,
        })
      } catch (error: any) {
        enqueueSnackbar(`Google Login request failed: ${error.toString()}`, {
          variant: "error",
        })
      }
    })
  }, [])

  return <></>
}
