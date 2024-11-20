import { useMutation } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ApiError, type UpdatePassword, UsersService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { confirmPasswordRules, handleError, isEmpty, passwordRules } from "../../utils";
import { FormControl, Label } from "../ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UpdatePasswordForm extends UpdatePassword {
    confirm_password: string;
}

const ChangePassword = () => {
    const showToast = useCustomToast();
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = useForm<UpdatePasswordForm>({
        mode: "onBlur",
        criteriaMode: "all",
    });

    const mutation = useMutation({
        mutationFn: (data: UpdatePassword) => UsersService.updatePasswordMe({ requestBody: data }),
        onSuccess: () => {
            showToast.success("Success!", "Password updated successfully.");
            reset();
        },
        onError: (err: ApiError) => {
            handleError(err, showToast);
        },
    });

    const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
        mutation.mutate(data);
    };

    return (
        <>
            <div className="w-full">
                <h2 className="py-1 text-lg">Change Password</h2>
                <form className="w-full md:w-1/2" onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <Label htmlFor="current_password">Current Password</Label>
                        <Input
                            id="current_password"
                            {...register("current_password")}
                            placeholder="Password"
                            type="password"
                            error={errors.current_password?.message}
                        />
                    </FormControl>
                    <FormControl className="mt-1">
                        <Label htmlFor="password">Set Password</Label>
                        <Input
                            id="password"
                            {...register("new_password", passwordRules())}
                            placeholder="Password"
                            type="password"
                            error={errors.new_password?.message}
                        />
                    </FormControl>
                    <FormControl className="mt-1">
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <Input
                            id="confirm_password"
                            {...register("confirm_password", confirmPasswordRules(getValues))}
                            placeholder="Password"
                            type="password"
                            error={errors.confirm_password?.message}
                        />
                    </FormControl>
                    <Button
                        className="mt-4"
                        color="primary"
                        type="submit"
                        isLoading={mutation.isPending}
                        disabled={!isEmpty(errors) || mutation.isPending}
                    >
                        Save
                    </Button>
                </form>
            </div>
        </>
    );
};
export default ChangePassword;
