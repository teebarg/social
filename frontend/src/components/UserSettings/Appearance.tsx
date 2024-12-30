import { type Theme, useTheme } from "@/context/theme-provider"
import { Check, MoonFilledIcon, SunFilledIcon } from "nui-react-icons"

// Define theme types
const themes = [
  {
    id: "light",
    name: "Light Mode",
    icon: <SunFilledIcon className="w-6 h-6 text-yellow-500" />,
    description: "Bright and clean interface",
  },
  {
    id: "dark",
    name: "Dark Mode",
    icon: <MoonFilledIcon className="w-6 h-6 text-indigo-400" />,
    description: "Easy on the eyes, perfect for night",
  },
  // {
  //     id: "system",
  //     name: "System Preference",
  //     icon: <Laptop className="w-6 h-6 text-gray-600" />,
  //     description: "Matches your device settings",
  // },
]

const Appearance = () => {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as Theme)
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-2 text-default-800">
        Choose Theme
      </h1>
      <p className="text-center text-default-600 mb-6">
        Select how you want your interface to look
      </p>

      <div className="space-y-4">
        {themes.map((item) => (
          <div
            key={item.id}
            onClick={() => handleThemeChange(item.id)}
            className={`
                              cursor-pointer flex items-center justify-between 
                              p-4 rounded-lg border-2 transition-all duration-300
                              ${
                                theme === item.id
                                  ? "border-primary-200"
                                  : "border-default-100 hover:border-primary-300"
                              }
                          `}
          >
            <div className="flex items-center space-x-4">
              {item.icon}
              <div>
                <h3 className="font-semibold text-default-700">{item.name}</h3>
                <p className="text-sm text-default-500">{item.description}</p>
              </div>
            </div>
            {theme === item.id && (
              <Check className="text-primary-500 w-6 h-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
export default Appearance
