import React from "react";
import { cn } from "../../utils";

const chipConfig: any = {
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
    sm: "h-5 text-xs",
    md: "h-6 text-small",
    lg: "h-7 text-sm",
};

interface Props {
    title: string;
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    size?: "sm" | "md" | "lg";
    className?: string;
}

const Chip: React.FC<Props> = ({ title, className = "", color = "primary", size = "sm" }) => {
    return (
        <React.Fragment>
            <div
                className={cn(
                    "relative max-w-fit min-w-min inline-flex items-center justify-between",
                    "box-border whitespace-nowrap px-1 rounded-full",
                    chipConfig[size],
                    chipConfig[color].bgColor,
                    chipConfig[color].color,
                    className
                )}
            >
                <span className="flex-1 text-inherit font-normal px-2">{title}</span>
            </div>
        </React.Fragment>
    );
};

export { Chip };
