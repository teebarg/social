import { cn } from "@/utils"
import type React from "react"
import { type ReactNode, createContext, useContext, useState } from "react"

interface TabContextType {
  activeTab: number
  setActiveTab: (index: number) => void
}

interface TabProps {
  children: ReactNode
  defaultTab?: number
  className?: string
}

interface HeaderProps {
  children: ReactNode
}

interface HeaderItemProps {
  index: number
  children: ReactNode
}

interface PanelsProps {
  children: ReactNode
}

interface PanelProps {
  index: number
  children: ReactNode
}

const TabContext = createContext<TabContextType | null>(null)

const useTabContext = (): TabContextType => {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error("Tab components must be used within a Tab provider")
  }
  return context
}

const Tab: React.FC<TabProps> & {
  Header: React.FC<HeaderProps>
  HeaderItem: React.FC<HeaderItemProps>
  Panels: React.FC<PanelsProps>
  Panel: React.FC<PanelProps>
} = ({ children, defaultTab = 0, className }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full max-w-2xl mx-auto p-6", className)}>
        {children}
      </div>
    </TabContext.Provider>
  )
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-8">{children}</div>
    </div>
  )
}

const HeaderItem: React.FC<HeaderItemProps> = ({ index, children }) => {
  const { activeTab, setActiveTab } = useTabContext()

  return (
    <button
      type="button"
      onClick={() => setActiveTab(index)}
      className={`
                py-4 px-1 relative font-medium text-sm
                ${
                  activeTab === index
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }
                transition-colors duration-200 focus:outline-none
            `}
      aria-selected={activeTab === index}
      role="tab"
    >
      {activeTab === index && (
        <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600" />
      )}
      {children}
    </button>
  )
}

const Panels: React.FC<PanelsProps> = ({ children }) => {
  return (
    <div className="mt-8" role="tabpanel">
      {children}
    </div>
  )
}

const Panel: React.FC<PanelProps> = ({ index, children }) => {
  const { activeTab } = useTabContext()

  return (
    <div
      className={`
                space-y-4 transition-opacity duration-200 ${
                  activeTab === index ? "block" : "hidden"
                }
            `}
      role="tabpanel"
      aria-hidden={activeTab !== index}
    >
      <div className="prose max-w-none">{children}</div>
    </div>
  )
}

// Compose the compound component
Tab.Header = Header
Tab.HeaderItem = HeaderItem
Tab.Panels = Panels
Tab.Panel = Panel

export default Tab
