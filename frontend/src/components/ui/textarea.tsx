import { cn } from "@/utils"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

type InputClassNames = Partial<
  Record<
    | "base"
    | "inputWrapper"
    | "label"
    | "innerWrapper"
    | "description"
    | "input",
    string
  >
>

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hidden?: boolean
  classNames?: InputClassNames
  className?: string
  error?: string
  description?: string
  isRequired?: boolean
  label?: string
  placeholder?: string
  errorMessage?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hidden,
      className,
      classNames,
      description,
      isRequired,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    // Local ref to handle the DOM element if ref is not provided
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const textAreaRef =
      (ref as React.MutableRefObject<HTMLTextAreaElement>) || internalRef

    const adjustHeight = () => {
      if (textAreaRef.current) {
        // Reset height to auto to calculate the scroll height properly
        textAreaRef.current.style.height = "auto"
        // Set height to scrollHeight but limit it to a max of 160px
        textAreaRef.current.style.height = `${Math.min(
          textAreaRef.current.scrollHeight,
          160,
        )}px`
      }
    }

    useEffect(() => {
      // Adjust height on mount
      adjustHeight()
    }, [])

    return (
      <React.Fragment>
        <div
          className={cn(
            "group flex flex-col data-[hidden=true]:hidden w-full",
            classNames?.base,
          )}
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
              "relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 bg-default-100 data-[hover=true]:bg-default-100 group-data-[focus=true]:bg-default-100",
              "min-h-10 rounded-medium flex-col items-start justify-center gap-0 !h-auto transition-background motion-reduce:transition-none !duration-150 outline-none",
              "group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2",
              "group-data-[focus-visible=true]:ring-offset-background py-2",
              classNames?.inputWrapper,
            )}
            data-hover={isHovered ? "true" : "false"}
            data-slot="input-wrapper"
            style={{ cursor: "text" }}
          >
            <label
              className={cn(
                "z-10 pointer-events-none origin-top-left rtl:origin-top-right subpixel-antialiased block text-foreground-500 cursor-text relative will-change-auto",
                "!duration-200 !ease-out motion-reduce:transition-none transition-[transform,color,left,opacity] group-data-[filled-within=true]:text-default-500",
                "group-data-[filled-within=true]:pointer-events-auto group-data-[filled-within=true]:scale-85 text-small pb-0.5 pe-2 max-w-full text-ellipsis overflow-hidden",
                classNames?.label,
              )}
              data-slot="label"
            >
              {label}
            </label>
            <div
              className={cn(
                "inline-flex w-full items-center h-full box-border group-data-[has-label=true]:items-end pb-0.5",
              )}
              data-slot="inner-wrapper"
            >
              <textarea
                {...props}
                ref={textAreaRef}
                className={cn(
                  "w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5",
                  "data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small resize-none",
                  "data-[hide-scroll=true]:scrollbar-hide group-data-[has-value=true]:text-default-foreground pt-0 transition-height !duration-100 motion-reduce:transition-none",
                  classNames?.input,
                )}
                data-hide-scroll="true"
                data-slot="input"
                style={{ height: "60px !important" }}
                onInput={adjustHeight}
                onBlur={(e) => {
                  setIsFocused(false)
                  props?.onBlur?.(e)
                }}
                onFocus={() => setIsFocused(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </div>
          </div>
          <div
            className="hidden group-data-[has-helper=true]:flex p-1 relative flex-col gap-1.5"
            data-slot="helper-wrapper"
          >
            {description && (
              <div
                className={cn(
                  "text-tiny text-foreground-400",
                  classNames?.description,
                )}
                data-slot="description"
              >
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
    )
  },
)

Textarea.displayName = "Textarea"

export { Textarea }
