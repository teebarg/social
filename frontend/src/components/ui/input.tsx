import { cn } from "@/utils";
import * as React from "react";
import { useState } from "react";

type InputClassNames = Partial<Record<"base" | "inputWrapper" | "label" | "innerWrapper" | "description" | "input", string>>;

interface InputProps {
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    size?: "sm" | "md" | "lg";
    hidden?: boolean;
    classNames?: InputClassNames;
    className?: string;
    type?: "text" | "number";
    error?: string;
    description?: string;
    isRequired?: boolean;
    label?: string;
    placeholder?: string;
    [key: string]: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { label, error, hidden, className, classNames, size = "sm", type = "text", endContent, startContent, description, isRequired, ...props },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState<boolean>(false);
        const [isHovered, setIsHovered] = useState<boolean>(false);

        return (
            <React.Fragment>
                <div
                    className={cn("group flex flex-col data-[hidden=true]:hidden w-full", classNames?.base)}
                    data-filled={isFocused || Boolean(props.placeholder || true)}
                    data-filled-within={isFocused || Boolean(props.placeholder || true)}
                    data-focus={isFocused}
                    data-focus-within={isFocused}
                    data-has-elements="true"
                    data-has-helper={Boolean(error) || Boolean(description)}
                    data-has-label={Boolean(label)}
                    data-has-value="true"
                    data-hidden={hidden}
                    data-hover={isHovered ? "true" : "false"}
                    data-invalid={Boolean(error)}
                    data-slot="base"
                >
                    <div
                        className={cn(
                            "relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 bg-default-100 data-[hover=true]:bg-default-200",
                            "group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none",
                            "!duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus",
                            "group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background min-w-[300px]",
                            {
                                "h-12 py-1.5": size === "sm",
                                "h-14 py-2": size === "md",
                                "h-16 py-2.5": size === "lg",
                            },
                            classNames?.inputWrapper
                        )}
                        data-focus={isFocused}
                        data-hover={isHovered ? "true" : "false"}
                        data-slot="input-wrapper"
                        style={{ cursor: "text" }}
                    >
                        <label
                            className={cn(
                                "absolute z-10 pointer-events-none origin-top-left rtl:origin-top-right subpixel-antialiased block text-foreground-500 cursor-text",
                                "after:text-danger after:ml-0.5 rtl:after:ml-[unset] rtl:after:mr-0.5 will-change-auto !duration-200 !ease-out motion-reduce:transition-none",
                                "transition-[transform,color,left,opacity] group-data-[filled-within=true]:text-default-600 group-data-[filled-within=true]:pointer-events-auto",
                                "group-data-[filled-within=true]:scale-85 text-small group-data-[filled-within=true]:-translate-y-[calc(50%_+_theme(fontSize.small)/2_-_6px)] pe-2",
                                "max-w-full text-ellipsis overflow-hidden",
                                {
                                    "after:content-['*']": isRequired,
                                },
                                classNames?.label
                            )}
                            data-slot="label"
                        >
                            {label}
                        </label>
                        <div
                            className={cn(
                                "inline-flex w-full items-center h-full box-border group-data-[has-label=true]:items-end pb-0.5",
                                classNames?.innerWrapper
                            )}
                            data-slot="inner-wrapper"
                        >
                            {startContent}
                            <input
                                ref={ref}
                                type={type}
                                required
                                {...props}
                                className={cn(
                                    "w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none",
                                    "data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0",
                                    "autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground",
                                    classNames?.input
                                )}
                                data-filled="true"
                                data-filled-within="true"
                                data-has-end-content={endContent ? "true" : "false"}
                                data-has-start-content={startContent ? "true" : "false"}
                                data-slot="input"
                                onBlur={(e) => {
                                    setIsFocused(false);
                                    props?.onBlur?.(e);
                                }}
                                onFocus={() => setIsFocused(true)}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            />
                            {endContent}
                        </div>
                    </div>
                    <div className="hidden group-data-[has-helper=true]:flex p-1 relative flex-col gap-1.5" data-slot="helper-wrapper">
                        {description && (
                            <div className={cn("text-tiny text-foreground-400", classNames?.description)} data-slot="description">
                                {description}
                            </div>
                        )}
                        {error && (
                            <div className="text-tiny text-danger" data-slot="error-message">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
);

Input.displayName = "Input";

export { Input };
