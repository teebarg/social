import { cn } from "@/utils";
import React from "react";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }>(
    ({ className = "", children, required, ...props }, ref) => (
        <label ref={ref} className={cn("text-xs font-medium text-inherit", className)} {...props}>
            {children}
            {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
    )
);

const Description = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-default-500", className)} {...props} />
));

const Error = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-rose-500", className)} {...props} />
));

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className = "", ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
));

Description.displayName = "Description";

export { Label, Description, Error, FormControl };
