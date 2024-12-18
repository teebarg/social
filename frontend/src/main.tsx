import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { SnackbarProvider } from "notistack"
import ReactDOM from "react-dom/client"
import "./index.css"
import { routeTree } from "./routeTree.gen"

import React, { StrictMode } from "react"
import { OpenAPI } from "./client"
import Toast from "./components/toast"

OpenAPI.BASE = import.meta.env.VITE_API_URL
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") || ""
}

const queryClient = new QueryClient()

const router = createRouter({ routeTree })
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

declare module "notistack" {
  interface VariantOverrides {
    toast: {
      description?: string
      status?: string
    }
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SnackbarProvider
      Components={{
        toast: Toast,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </SnackbarProvider>
  </StrictMode>,
)
