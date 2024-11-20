import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ApiError, LoginService } from "../client";
import { isLoggedIn } from "@/hooks/useAuth";
import { emailPattern, handleError } from "../utils";
import { FormControl } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useCustomToast from "@/hooks/useCustomToast";

interface FormData {
    email: string;
}

export const Route = createFileRoute("/recover-password")({
    component: RecoverPassword,
    beforeLoad: async () => {
        if (isLoggedIn()) {
            throw redirect({
                to: "/",
            });
        }
    },
});

function RecoverPassword() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormData>();
    const showToast = useCustomToast();

    const recoverPassword = async (data: FormData) => {
        await LoginService.recoverPassword({
            email: data.email,
        });
    };

    const mutation = useMutation({
        mutationFn: recoverPassword,
        onSuccess: () => {
            showToast.success("Email sent.", "We sent an email with a link to get back into your account.");
            reset();
        },
        onError: (err: ApiError) => {
            handleError(err, showToast);
        },
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex h-screen">
          <form className="max-w-md gap-4 m-auto p-8 rounded-lg shadow-lg" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl mb-2 text-center">Password Recovery</h2>
            <p className="text-center mb-4">A password recovery email will be sent to the registered account.</p>
            <FormControl>
                <Input
                    id="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: emailPattern,
                    })}
                    placeholder="Email"
                    type="email"
                    error={errors?.email?.message}
                />
            </FormControl>
            <Button className="mt-4" color="primary" type="submit" isLoading={mutation.isPending} disabled={!isDirty || mutation.isPending}>
                Continue
            </Button>
        </form>
        </div>
    );
}
