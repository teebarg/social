import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import Sidebar from "@/components/Common/Sidebar"
import UserMenu from "@/components/Common/UserMenu"
import { Spinner } from "@/components/ui/spinner"
import useAuth, { isLoggedIn } from "../hooks/useAuth"

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      })
    }
  },
})

function Layout() {
  const { isLoading } = useAuth()

  return (
    <div className="w-full flex h-auto relative">
      <Sidebar />
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Spinner size="lg" color="danger" />
        </div>
      ) : (
        <Outlet />
      )}
      <UserMenu />
    </div>
  )
}
