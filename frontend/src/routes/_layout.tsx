import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import Sidebar from "@/components/Common/Sidebar"
import UserMenu from "@/components/Common/UserMenu"
import ThemeToggle from "@/components/theme-button"
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
      <div className="flex flex-col h-screen flex-1">
        <div className="flex flex-row-reverse gap-2 items-center py-2 px-4 shadow-xl">
          <UserMenu />
          <ThemeToggle />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center w-full flex-1">
            <Spinner size="lg" color="danger" />
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  )
}
