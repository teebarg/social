import React from "react";

interface SkeletonTextProps {
    noOfLines?: number;
    paddingBlock?: string;
    width?: string;
    className?: string;
}

const SkeletonText: React.FC<SkeletonTextProps> = ({ noOfLines = 1, paddingBlock = "16px", width = "w-full", className = "" }) => {
    return (
        <div style={{ paddingBlock }} className={`animate-pulse ${width} ${className}`}>
            {[...Array(noOfLines)].map((_, index) => (
                <div
                    key={index}
                    className={`
                        h-4 bg-gray-300 rounded mb-2 last:w-3/4 
                        ${index === noOfLines - 1 ? "last:mb-0" : ""}
                    `}
                />
            ))}
        </div>
    );
};

export default SkeletonText;
