import React from "react";
import { useClickOutside } from "../../hooks/use-click-outside";
import { OverlayContainer } from "@react-aria/overlays";
import { Check, ChevronDown } from "nui-react-icons";
import { createContext, useContext, useRef, useState } from "react";
import { cn } from "../../utils";

type SelectContextType = {
    value: string;
    onChange: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    children: React.ReactNode;
    className?: string;
}

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

export function useSelect() {
    const context = useContext(SelectContext);
    if (!context) {
        throw new Error("useSelect must be used within a SelectProvider");
    }
    return context;
}

export const SelectProvider = SelectContext.Provider;

export function SelectItem({ value, children, className }: SelectItemProps) {
    const { value: selectedValue, onChange, setIsOpen } = useSelect();
    const isSelected = selectedValue === value;

    const handleSelect = () => {
        onChange(value);
        setIsOpen(false);
    };

    return (
        <div
            className={cn(
                "relative flex items-center px-3 py-2 cursor-pointer",
                "hover:bg-muted/50 transition-colors",
                isSelected && "bg-muted",
                className
            )}
            onClick={handleSelect}
        >
            <span className="flex-grow">{children}</span>
            {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
        </div>
    );
}

export function Select({ value, onChange, placeholder = "Select an option", children, className }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useClickOutside(selectRef, () => setIsOpen(false));

    const toggleSelect = () => setIsOpen(!isOpen);

    return (
        <SelectProvider value={{ value, onChange, isOpen, setIsOpen }}>
            <div className="relative" ref={selectRef}>
                <div
                    onClick={toggleSelect}
                    className={cn(
                        "flex items-center justify-between w-full px-3 py-2",
                        "border rounded-md shadow-sm cursor-pointer",
                        "bg-background hover:bg-accent transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        isOpen && "ring-2 ring-ring ring-offset-2",
                        className
                    )}
                >
                    <span className={cn("block truncate", !value && "text-default-500")}>{value || placeholder}</span>
                    <ChevronDown className={cn("h-4 w-4 text-default-500 transition-transform duration-200", isOpen && "transform rotate-180")} />
                </div>
                {isOpen && (
                    <OverlayContainer>
                        <div
                            // {...overlayProps}
                            // ref={overlayRef}
                            className={cn("absolute z-50 w-full mt-1 rounded-md shadow-lg", "bg-background border animate-in fade-in-0 zoom-in-95")}
                            // style={{
                            //     top: popoverPosition.top,
                            //     left: popoverPosition.left,
                            // }}
                        >
                            <div className="py-1 max-h-60 overflow-auto">{children}</div>
                        </div>
                    </OverlayContainer>
                )}

                {/* {isOpen && (
                    <div className={cn("absolute z-50 w-full mt-1 rounded-md shadow-lg", "bg-background border animate-in fade-in-0 zoom-in-95")}>
                        <div className="py-1 max-h-60 overflow-auto">{children}</div>
                    </div>
                )} */}
            </div>
        </SelectProvider>
    );
}
