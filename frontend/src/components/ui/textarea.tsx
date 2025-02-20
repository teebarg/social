import { cn } from "@/utils";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

type InputClassNames = Partial<Record<"base" | "inputWrapper" | "label" | "innerWrapper" | "description" | "input", string>>;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    hidden?: boolean;
    classNames?: InputClassNames;
    className?: string;
    error?: string;
    description?: string;
    isRequired?: boolean;
    label?: string;
    placeholder?: string;
    errorMessage?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hidden, className, classNames, description, isRequired, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState<boolean>(false);
        const [isHovered, setIsHovered] = useState<boolean>(false);

        // Local ref to handle the DOM element if ref is not provided
        const internalRef = useRef<HTMLTextAreaElement>(null);
        const textAreaRef = (ref as React.MutableRefObject<HTMLTextAreaElement>) || internalRef;

        const adjustHeight = () => {
            if (textAreaRef.current) {
                // Reset height to auto to calculate the scroll height properly
                textAreaRef.current.style.height = "auto";
                // Set height to scrollHeight but limit it to a max of 160px
                textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 160)}px`;
            }
        };

        useEffect(() => {
            // Adjust height on mount
            adjustHeight();
        }, []);

        return (
            <React.Fragment>
                <div
                    className={cn("group flex flex-col data-[hidden=true]:hidden w-full focus-visible:outline-none", classNames?.base)}
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
                            "relative w-full inline-flex shadow-sm px-3 bg-default-100 data-[hover=true]:bg-default-200",
                            "rounded-xl flex-col items-start justify-center gap-0 !h-auto py-2",
                            classNames?.inputWrapper
                        )}
                        data-hover={isHovered ? "true" : "false"}
                        data-slot="input-wrapper"
                        style={{ cursor: "text" }}
                    >
                        <label
                            className={cn(
                                "z-10 pointer-events-none block text-foreground-500 cursor-text relative text-sm pb-0.5 max-w-full",
                                "duration-200 transition-[transform,color,left,opacity] group-data-[filled-within=true]:text-default-500",
                                classNames?.label
                            )}
                            data-slot="label"
                        >
                            {label}
                        </label>
                        <div
                            className={cn("inline-flex w-full items-center h-full box-border group-data-[has-label=true]:items-end pb-0.5")}
                            data-slot="inner-wrapper"
                        >
                            <textarea
                                {...props}
                                ref={textAreaRef}
                                className={cn(
                                    "w-full font-normal bg-transparent outline-none placeholder:text-foreground-500 focus-visible:outline-none text-sm",
                                    "group-data-[has-value=true]:text-default-foreground pt-0 transition-height duration-100 autofill:bg-transparent resize-none",
                                    classNames?.input
                                )}
                                data-hide-scroll="true"
                                data-slot="input"
                                style={{ height: "60px !important" }}
                                onInput={adjustHeight}
                                onBlur={(e) => {
                                    setIsFocused(false);
                                    props?.onBlur?.(e);
                                }}
                                onFocus={() => setIsFocused(true)}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            />
                        </div>
                    </div>
                    <div className="hidden group-data-[has-helper=true]:flex p-1 relative flex-col gap-1.5" data-slot="helper-wrapper">
                        {description && (
                            <div className={cn("text-xs text-foreground-400", classNames?.description)} data-slot="description">
                                {description}
                            </div>
                        )}
                        {error && (
                            <div className="text-xs text-danger" data-slot="error-message">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
);

Textarea.displayName = "Textarea";

export { Textarea };
