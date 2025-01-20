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
                    className={cn("group focus-visible:outline-none data-[hidden=true]:hidden w-full", classNames?.base)}
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
                            "relative w-full flex-col items-start justify-center inline-flex shadow-sm px-3 bg-default-100 rounded-medium outline-none",
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
                                "absolute z-10 block text-foreground-500 cursor-text after:text-danger after:ml-0.5 duration-200 ease-out transition-all",
                                "group-data-[filled=true]:text-default-500 group-data-[filled=true]:pointer-events-auto max-w-full text-ellipsis overflow-hidden",
                                "group-data-[filled=true]:scale-85 text-xs group-data-[filled=true]:-translate-y-[calc(50%_+_theme(fontSize.small)/2_-_2px)]",
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
                                    "w-full bg-transparent font-normal placeholder:text-foreground-500 focus-visible:outline-none group-data-[has-label=true]:mt-auto autofill:bg-transparent data-[has-end-content=true]:pe",
                                    "file:cursor-pointer file:bg-transparent file:border-0 text-small group-data-[has-value=true]:text-default-foreground data-[has-start-content=true]:ps-1.5",
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
