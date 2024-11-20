import { CustomContentProps } from "notistack";
import React, { forwardRef } from "react";
import { cn } from "../utils";

interface ReportCompleteProps extends CustomContentProps {
    description?: string;
    status?: string;
}

const Toast = forwardRef<HTMLDivElement, ReportCompleteProps>(({ id, ...props }, ref) => {
    const { message, description, iconVariant, status } = props;

    return (
        <div
            ref={ref}
            className={cn("z-50 p-4 rounded-lg shadow-xl flex items-start min-w-96 max-w-[450px]", {
                "bg-green-100 text-green-700": status === "success",
                "bg-danger-100 text-danger-700": status === "error",
                "bg-warning-100 text-warning-700": status === "warning",
                "bg-blue-100 text-blue-700": status === "info",
            })}
        >
            <div className="flex-shrink-0">{iconVariant[status as string]}</div>
            <div>
                <p className="font-semibold text-sm">{message}</p>
                {description && <p className="text-sm mt-1">{description}</p>}
            </div>
        </div>
    );
});

export default Toast;
