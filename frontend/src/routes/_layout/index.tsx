import { createFileRoute } from "@tanstack/react-router"

import useAuth from "../../hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

function Dashboard() {
  const { user: currentUser } = useAuth()

  return (
    <>
      <div className="max-w-full">
        <div className="pt-4 m-1">
          <p className="text-2xl">
            Hi, {currentUser?.first_name || currentUser?.email} 👋🏼
          </p>
          <p>Welcome back, nice to see you again!</p>
        </div>
      </div>
    </>
  )
}
