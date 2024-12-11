import Dropdown from "@/components/ui/dropdown"
import useAuth from "@/hooks/useAuth"
import { Link } from "@tanstack/react-router"
import { LogOut, User, UserCircleMini } from "nui-react-icons"

const UserMenu = () => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    logout()
  }

  return (
    <>
      {/* Desktop */}
      <div className="fixed hidden md:block top-4 right-4">
        <Dropdown
          align="end"
          trigger={<UserCircleMini viewBox="0 0 24 24" className="h-12 w-12" />}
        >
          <div>
            <div className="bg-default-100 rounded-lg shadow-md p-3 min-w-[100px] text-sm font-medium">
              <div className="mb-2">
                <Link className="flex w-full items-center" to="settings">
                  <span className="mr-2">
                    <User viewBox="0 0 24 24" className="h-6 w-6" />
                  </span>
                  <span>My profile</span>
                </Link>
              </div>
              <button
                className="flex w-full items-center text-rose-500 font-semibold"
                onClick={handleLogout}
              >
                <span className="mr-2">
                  <LogOut viewBox="0 0 24 24" className="h-6 w-6" />
                </span>
                <span>Log out</span>
              </button>
            </div>
          </div>
        </Dropdown>
      </div>
    </>
  )
}

export default UserMenu
