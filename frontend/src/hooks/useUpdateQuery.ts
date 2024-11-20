import { debounce } from "@/utils";
import { useCallback } from "react";

interface QueryParam {
    key: string;
    value: string;
}

const useUpdateQuery = (delay = 500) => {
    const updateQuery = useCallback(
        debounce((data: QueryParam[]) => {
            console.log(data);
        }, delay),
        []
    );

    return { updateQuery };
};

export { useUpdateQuery };
