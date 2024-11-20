import React from "react";
import { cn } from "../../utils";

const badgeConfig: any = {
    primary: {
        bgColor: "bg-primary",
        color: "text-primary-foreground",
    },
    secondary: {
        bgColor: "bg-secondary",
        color: "text-secondary-foreground",
    },
    default: {
        bgColor: "bg-default",
        color: "text-default-foreground",
    },
    danger: {
        bgColor: "bg-danger",
        color: "text-danger-foreground",
    },
    warning: {
        bgColor: "bg-warning",
        color: "text-warning-foreground",
    },
    success: {
        bgColor: "bg-success",
        color: "text-success-foreground",
    },

    // Sizes
    sm: {
        children: "w-10 h-10",
        content: "text-tiny w-4 h-4 min-w-4 min-h-4",
    },
    md: {
        children: "w-12 h-12",
        content: "text-small w-5 h-5 min-w-5 min-h-5",
    },
    lg: {
        children: "w-14 h-14",
        content: "text-small w-6 h-6 min-w-6 min-h-6",
    },
};

interface BadgeProps {
    children: React.ReactNode;
    content?: React.ReactNode | string;
    color?: "primary" | "secondary" | "default" | "danger" | "warning" | "success";
    placement?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
    size?: "sm" | "md" | "lg";
    isBordered?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ children, content, isBordered = false, color = "primary", placement = "bottom-right", size = "sm" }) => {
    return (
        <React.Fragment>
            <div className="relative inline-flex shrink-0">
                <span
                    className={cn(
                        "flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-none rounded-medium",
                        {
                            "ring-2 ring-offset-2 ring-offset-background dark:ring-offset-background-dark ring-success": isBordered,
                        },
                        badgeConfig[size].children,
                        badgeConfig[color].bgColor,
                        badgeConfig[color].color
                    )}
                >
                    {children}
                </span>
                <span
                    className={cn(
                        "flex z-10 flex-wrap absolute box-border rounded-full whitespace-nowrap place-content-center origin-center items-center select-none font-regular px-0 border-2 border-background",
                        {
                            "top-[5%] right-[5%] translate-x-1/2 -translate-y-1/2": placement == "top-right",
                            "bottom-[5%] right-[5%] translate-x-1/2 translate-y-1/2": placement == "bottom-right",
                            "top-[5%] left-[5%] -translate-x-1/2 -translate-y-1/2": placement == "top-left",
                            "bottom-[5%] left-[5%] -translate-x-1/2 translate-y-1/2": placement == "bottom-left",
                        },
                        badgeConfig[size].content,
                        badgeConfig[color].bgColor,
                        badgeConfig[color].color
                    )}
                >
                    {content}
                </span>
            </div>
        </React.Fragment>
    );
};

export { Badge };
