import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApiError } from "./client";
import type { ToastMethods } from "./hooks/useCustomToast";

export const emailPattern = {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Invalid email address",
};

export const namePattern = {
    value: /^[A-Za-z\s\u00C0-\u017F]{1,30}$/,
    message: "Invalid name",
};

export const passwordRules = (isRequired = true) => {
    const rules: any = {
        minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
        },
    };

    if (isRequired) {
        rules.required = "Password is required";
    }

    return rules;
};

export const confirmPasswordRules = (getValues: () => any, isRequired = true) => {
    const rules: any = {
        validate: (value: string) => {
            const password = getValues().password || getValues().new_password;
            return value === password ? true : "The passwords do not match";
        },
    };

    if (isRequired) {
        rules.required = "Password confirmation is required";
    }

    return rules;
};

export const handleError = (err: ApiError, showToast: ToastMethods) => {
    const errDetail = (err.body as any)?.detail;
    let errorMessage = errDetail || "Something went wrong.";
    if (Array.isArray(errDetail) && errDetail.length > 0) {
        errorMessage = errDetail[0].msg;
    }
    showToast.error("Error", errorMessage);
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
}

// eslint-disable-next-line
export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
    let timer: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};
