import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import type { UserPublic } from "@/client"
import Appearance from "@/components/UserSettings/Appearance"
import ChangePassword from "@/components/UserSettings/ChangePassword"
import DeleteAccount from "@/components/UserSettings/DeleteAccount"
import UserInformation from "@/components/UserSettings/UserInformation"
import Tab from "@/components/ui/Tab"

const tabsConfig = [
  { title: "My profile", component: UserInformation },
  { title: "Password", component: ChangePassword },
  { title: "Appearance", component: Appearance },
  { title: "Danger zone", component: DeleteAccount },
]

export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
})

function UserSettings() {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const finalTabs = currentUser?.is_superuser
    ? tabsConfig.slice(0, 4)
    : tabsConfig

  return (
    <div className="py-2 px-8">
      <h2 className="text-center md:text-left py-4">User Settings</h2>
      <Tab defaultTab={0} className="mx-0">
        <Tab.Header>
          {finalTabs.map((tab, index) => (
            <Tab.HeaderItem key={index} index={index}>
              {tab.title}
            </Tab.HeaderItem>
          ))}
        </Tab.Header>

        <Tab.Panels>
          {finalTabs.map((tab, index) => (
            <Tab.Panel key={index} index={index}>
              <tab.component />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab>
    </div>
  )
}
