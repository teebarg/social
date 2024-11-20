import React, { useState } from "react";
import { Calendar, Check, ChevronRight, CogSixTooth, Component, DocumentText, EcommerceIcon, User, Users, Window } from "nui-react-icons";
import clsx from "clsx";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils";
import type { UserPublic } from "@/client/models";
import { useQueryClient } from "@tanstack/react-query";

interface MenuItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
    suffix?: React.ReactNode;
    disabled?: boolean;
    exact?: boolean; // Whether to match the route exactly
}

interface SubMenuItem {
    subMenu: string;
    icon?: React.ReactNode;
    suffix?: React.ReactNode;
    menuItems: (MenuItem | SubMenuItem)[];
}

const MenuLink = ({ href, className, children, disabled }: { href: string; className: string; children: React.ReactNode; disabled?: boolean }) => {
    if (disabled) {
        return <span className={className}>{children}</span>;
    }

    return (
        <Link
            className={className}
            to={href}
            activeProps={{
                style: {
                    background: "#fecdd3",
                    color: "#9f1239",
                },
            }}
        >
            {children}
        </Link>
    );
};

const SubMenuComponent: React.FC<{
    item: SubMenuItem;
    level?: number;
    isCollapsed?: boolean;
}> = ({ item, isCollapsed, level = 0 }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const contentRef = React.useRef<HTMLDivElement>(null);

    // const isActive = (href: any) => useMatch({ from: href });
    const isActive = (href: any) => true;

    const isChildActive = (items: (MenuItem | SubMenuItem)[]): boolean => {
        return items.some((subItem) => {
            if ("subMenu" in subItem) {
                return isChildActive(subItem.menuItems);
            }

            return isActive(subItem.href);
        });
    };

    React.useEffect(() => {
        if (isChildActive(item.menuItems)) {
            setIsOpen(true);
        }
    }, []);

    return (
        <div className="w-full">
            <button
                className={cn(`
                    w-full flex items-center justify-between p-4 text-default-500 hover:text-default-600
                    transition-colors duration-200 group
                    ${level === 0 ? "!pl-4" : `!pl-${level * 4 + 4}`}
                    ${level === 1 ? "hover:bg-content2 bg-content1" : ""}
                    ${level === 2 ? "hover:bg-content2 bg-content3" : ""}
                `)}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {item.icon && <div className="text-inherit group-hover:text-inherit transition-colors duration-200">{item.icon}</div>}
                    <span
                        className={clsx("text-sm font-medium", {
                            hidden: isCollapsed,
                        })}
                    >
                        {item.subMenu}
                    </span>
                </div>
                <div
                    className={clsx("text-sm font-medium transform transition-transform duration-200", {
                        hidden: isCollapsed,
                        "rotate-90": isOpen,
                    })}
                >
                    <ChevronRight size={18} />
                </div>
            </button>

            <div
                className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? "max-h-96" : "max-h-0"}
                `}
            >
                <div ref={contentRef}>
                    {item.menuItems.map((subItem, index) =>
                        "subMenu" in subItem ? (
                            <SubMenuComponent key={index} item={subItem as SubMenuItem} level={(level || 0) + 1} />
                        ) : (
                            <MenuItemComponent key={index} item={subItem as MenuItem} level={(level || 0) + 1} />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

const MenuItemComponent: React.FC<{
    item: MenuItem;
    level?: number;
    isCollapsed?: boolean;
}> = ({ item, isCollapsed, level = 0 }) => {
    return (
        <MenuLink
            className={cn(
                "flex items-center justify-between p-4 transition-all duration-200 group",
                `${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer text-default-500 hover:text-default-600"} ${
                    level === 0 ? "!pl-4" : `!pl-${level * 4 + 4}`
                }`,
                {
                    "hover:bg-content2 bg-content1": level === 1,
                    "hover:bg-content2 bg-content3 pl-12": level === 2,
                    "hover:bg-content3 bg-content4 pl-16": level === 3,
                }
            )}
            href={item.href}
        >
            <div className="flex items-center gap-2">
                {item.icon && <div className="text-inherit group-hover:text-inherit transition-colors duration-200">{item.icon}</div>}
                <span
                    className={clsx("text-sm font-medium", {
                        hidden: isCollapsed,
                    })}
                >
                    {item.label}
                </span>
            </div>
            {item.suffix && <div className="flex items-center">{item.suffix}</div>}
        </MenuLink>
    );
};

const Sidebar: React.FC = () => {
    const queryClient = useQueryClient();
    const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navItems: (MenuItem | SubMenuItem)[] = [
        {
            subMenu: "Admin",
            icon: <CogSixTooth size={20} />,
            menuItems: [
                {
                    label: "Dashboard",
                    href: "/",
                    icon: <Window size={18} />,
                },
                {
                    label: "Settings",
                    href: "/settings",
                    icon: <CogSixTooth size={18} />,
                },
                {
                    label: "Users",
                    href: "/items",
                    icon: <Users size={18} />,
                },
                {
                    label: "Admin",
                    href: "/admin",
                    icon: <Users size={18} />,
                },
            ],
        },
    ];

    const navs = [
        {
            group: "General",
            iems: navItems,
        },
    ];

    return (
        <div
            className={clsx(
                "h-screen bg-gradient-to-b from-default-100 via-danger-100 to-secondary-100 border-r border-default-100 flex flex-col",
                "transition-all duration-300 ease-in-out w-[22rem] text-default-500",
                {
                    "!w-20": isCollapsed,
                }
            )}
        >
            <div className="p-4 flex items-center justify-between mb-4">
                <h1
                    className={clsx("font-semibold text-3xl transition-opacity duration-200 opacity-100", {
                        "!opacity-0 w-0": isCollapsed,
                    })}
                >
                    Socials
                </h1>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <ChevronRight className={`transform transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {navs.map((nav, index: number) => (
                    <React.Fragment key={index}>
                        <div className={`px-4 mb-2 transition-opacity duration-200 mt-8 first:mt-0 ${isCollapsed ? "opacity-0" : "opacity-70"}`}>
                            <p className="text-xs font-bold text-default-500 uppercase tracking-wider">{nav.group}</p>
                        </div>

                        <nav>
                            {nav.iems.map((item, index: number) =>
                                "subMenu" in item ? (
                                    <SubMenuComponent key={index} isCollapsed={isCollapsed} item={item as SubMenuItem} />
                                ) : (
                                    <MenuItemComponent key={index} isCollapsed={isCollapsed} item={item as MenuItem} />
                                )
                            )}
                        </nav>
                    </React.Fragment>
                ))}
                <div className="mt-auto">
                    {currentUser?.email && <p className="text-secondary text-sm p-2 max-w-44">Logged in as: {currentUser.email}</p>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
