import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/utils";

type Props = {
    className?: string;
};

const Loading: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn("flex items-center justify-center w-full h-screen", className)}>
            <Spinner size="lg" color="danger" />
        </div>
    );
};

export { Loading };
