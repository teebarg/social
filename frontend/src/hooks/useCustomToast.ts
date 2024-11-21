import { useSnackbar } from "notistack"
import { useCallback } from "react"

declare module "notistack" {
  interface VariantOverrides {
    toast: {
      description?: string
      status?: string
    }
  }
}

export interface ToastMethods {
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
}

const useCustomToast = (): ToastMethods => {
  const { enqueueSnackbar } = useSnackbar()

  const createToast = useCallback(
    (
      variant: "success" | "error" | "toast",
      status: "success" | "error" | "warning" | "info",
    ) =>
      (title: string, description = "") => {
        enqueueSnackbar(title, {
          variant,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 3000,
          description,
          status,
        })
      },
    [enqueueSnackbar],
  )

  return {
    success: createToast("toast", "success"),
    error: createToast("toast", "error"),
    info: createToast("toast", "info"),
    warning: createToast("toast", "warning"),
  }
}

export default useCustomToast
