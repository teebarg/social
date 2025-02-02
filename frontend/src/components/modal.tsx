import { OverlayContainer, type OverlayProps, useOverlay, usePreventScroll } from "@react-aria/overlays";
import clsx from "clsx";
import { XMark } from "nui-react-icons";
import type React from "react";
import { useRef } from "react";

interface ModalProps extends OverlayProps {
    title?: string;
    children: React.ReactNode;
    isOpen?: boolean;
    hasX?: boolean;
    size?: "sm" | "md" | "lg";
    onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, isOpen, size = "sm", hasX = true }) => {
    const ref = useRef<HTMLDivElement>(null);

    usePreventScroll();
    // Setup the modal with useOverlay for accessibility
    const { overlayProps, underlayProps } = useOverlay(
        {
            isOpen,
            onClose,
            isDismissable: true, // This allows dismissing by clicking outside or pressing Escape
        },
        ref
    );

    return (
        <OverlayContainer>
            <div
                {...underlayProps}
                className="group fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/60"
                data-has-x={hasX ? "true" : "false"}
            >
                <div
                    {...overlayProps}
                    ref={ref}
                    className={clsx("bg-content1 rounded-lg w-full focus-visible:ring-offset-0 focus-visible:outline-none relative", {
                        "max-w-lg": size === "sm",
                        "max-w-2xl": size === "md",
                        "max-w-5xl": size === "lg",
                    })}
                >
                    {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
                    <button className="absolute top-4 right-4 hidden group-data-[has-x=true]:block" onClick={onClose}>
                        <XMark size={20} />
                    </button>
                    <div>{children}</div>
                </div>
            </div>
        </OverlayContainer>
    );
};

export { Modal };
