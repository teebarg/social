import { Check, MoonFilledIcon, SunFilledIcon } from "nui-react-icons";
import { useEffect, useState } from "react";

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
];

const Appearance = () => {
    const [selectedTheme, setSelectedTheme] = useState<string>(() => {
        return localStorage.getItem("theme") || "system";
    });

    // Handle theme changes
    useEffect(() => {
        const applyTheme = () => {
            const isDark = selectedTheme === "dark" || (selectedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }

            // Save theme preference
            localStorage.setItem("theme", selectedTheme);
        };

        applyTheme();
    }, [selectedTheme]);

    const handleThemeChange = (themeId: string) => {
        setSelectedTheme(themeId);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-center mb-2 text-default-800">Choose Theme</h1>
            <p className="text-center text-default-600 mb-6">Select how you want your interface to look</p>

            <div className="space-y-4">
                {themes.map((theme) => (
                    <div
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`
                              cursor-pointer flex items-center justify-between 
                              p-4 rounded-lg border-2 transition-all duration-300
                              ${selectedTheme === theme.id ? "border-primary-200" : "border-default-100 hover:border-primary-300"}
                          `}
                    >
                        <div className="flex items-center space-x-4">
                            {theme.icon}
                            <div>
                                <h3 className="font-semibold text-default-700">{theme.name}</h3>
                                <p className="text-sm text-default-500">{theme.description}</p>
                            </div>
                        </div>
                        {selectedTheme === theme.id && <Check className="text-primary-500 w-6 h-6" />}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Appearance;
