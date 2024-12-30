import { useTheme } from "@/context/theme-provider"
import { MoonFilledIcon, SunFilledIcon } from "nui-react-icons"
import React from "react"

type Props = {}

const ThemeToggle: React.FC<Props> = () => {
  const { theme, toggleTheme } = useTheme()
  const icon =
    theme === "dark" ? (
      <SunFilledIcon className="h-6 w-6" />
    ) : (
      <MoonFilledIcon className="h-6 w-6" />
    )

  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault() // Prevent default action to avoid double triggering
    toggleTheme()
  }

  return (
    <React.Fragment>
      <label className="relative select-none p-2 transition-opacity hover:opacity-80 cursor-pointer border-[1px] border-default-200 rounded-full flex items-center">
        <button
          className="relative w-auto h-auto bg-transparent flex items-center justify-center pt-0 px-0 mx-0 !text-default-400 dark:!text-default-500"
          onClick={handleToggle}
        >
          {icon}
        </button>
      </label>
    </React.Fragment>
  )
}

export default ThemeToggle
