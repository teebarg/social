import * as React from "react";
import type { AriaSelectProps } from "@react-types/select";
import { useSelectState } from "react-stately";
import { useSelect, HiddenSelect } from "@react-aria/select";
import { Popover } from "./popover";
import { ListBox } from "./listbox";
import { ChevronUpDown } from "nui-react-icons";
import { useButton } from "@react-aria/button";
import { cn } from "@/utils";

export { Item } from "react-stately";

interface Props extends AriaSelectProps<any> {
    className: string;
}

export function Select(props: Props) {
    // export const Select: React.FC<Props> = (props) => {
    // Create state based on the incoming props
    let state = useSelectState(props);

    // Get props for child elements from useSelect
    let ref = React.useRef(null);
    let { labelProps, triggerProps, valueProps, menuProps } = useSelect(props, state, ref);

    // Get props for the button based on the trigger props from useSelect
    let { buttonProps } = useButton(triggerProps, ref);

    // let { focusProps, isFocusVisible } = useFocusRing();

    return (
        <div className={cn("inline-flex flex-col relative mt-4", props.className)}>
            <div {...labelProps} className="block text-sm font-medium text-default-700 text-left cursor-default">
                {props.label}
            </div>
            <HiddenSelect state={state} triggerRef={ref} label={props.label} name={props.name} />
            <button
                {...buttonProps}
                ref={ref}
                className={`pl-3 flex-row items-center justify-between rounded-md overflow-hidden cursor-default shadow-sm border-2 relative px-3 w-full inline-flex tap-highlight-transparent group-data-[focus=true]:bg-default-50 gap-0 bg-default-100 data-[hover=true]:bg-default-50 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-14 min-h-14 py-2 ${
                    state.isOpen ? "bg-gray-100" : "bg-white"
                }`}
            >
                <span {...valueProps} className={`text-md ${state.selectedItem ? "text-gray-800" : "text-gray-500"}`}>
                    {state.selectedItem ? state.selectedItem.rendered : "Select an option"}
                </span>
                <ChevronUpDown className={"w-5 h-5"} />
            </button>
            {state.isOpen && (
                <Popover state={state} triggerRef={ref} placement="bottom start" className="">
                    <ListBox {...menuProps} state={state} />
                </Popover>
            )}
        </div>
    );
}
