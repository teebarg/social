import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ApiError, type UserPublic, type UserUpdateMe, UsersService } from "../../client";
import { cn, emailPattern, handleError, isEmpty } from "../../utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import useCustomToast from "@/hooks/useCustomToast";

const UserInformation = () => {
    const queryClient = useQueryClient();
    const showToast = useCustomToast();
    const [editMode, setEditMode] = useState(false);
    const { user: currentUser } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<UserPublic>({
        // mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            first_name: currentUser?.first_name,
            last_name: currentUser?.last_name,
            email: currentUser?.email,
        },
    });

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const mutation = useMutation({
        mutationFn: (data: UserUpdateMe) => UsersService.updateUserMe({ requestBody: data }),
        onSuccess: () => {
            showToast.success("Success!", "User updated successfully.");
        },
        onError: (err: ApiError) => {
            handleError(err, showToast);
        },
        onSettled: () => {
            toggleEditMode();
            queryClient.invalidateQueries();
        },
    });

    const onSubmit: SubmitHandler<UserUpdateMe> = async (data) => {
        mutation.mutate(data);
    };

    const handleEdit = () => {
        // Programmatically submit the form
        handleSubmit(onSubmit)();
    };

    const onCancel = () => {
        reset();
        toggleEditMode();
    };

    return (
        <div>
            <h2 className="py-1 font-semibold text-2xl">User Information</h2>
            <form>
                <div>
                    <Label htmlFor="first_name">First name</Label>
                    {editMode ? (
                        <Input
                            {...register("first_name", {
                                required: "First name is required",
                                maxLength: {
                                    value: 30,
                                    message: "This input must not exceed 30 characters",
                                },
                            })}
                            error={errors.first_name?.message}
                        />
                    ) : (
                        <p className="py-0.5 text-opacity-50 max-w-60 truncate">{currentUser?.first_name || "N/A"}</p>
                    )}
                </div>
                <div className="mt-2">
                    <Label htmlFor="last_name">Last name</Label>
                    {editMode ? (
                        <Input
                            {...register("last_name", {
                                required: "Last name is required",
                                maxLength: {
                                    value: 30,
                                    message: "This input must not exceed 30 characters",
                                },
                            })}
                            error={errors.last_name?.message}
                        />
                    ) : (
                        <p className={cn("py-0.5 max-w-60 truncate", !currentUser?.last_name && "text-opacity-50")}>
                            {currentUser?.last_name || "N/A"}
                        </p>
                    )}
                </div>
                <div className="mt-2">
                    <Label htmlFor="email">Email</Label>
                    {editMode ? (
                        <Input
                            {...register("email", {
                                required: "Email is required",
                                pattern: emailPattern,
                            })}
                            error={errors.email?.message}
                        />
                    ) : (
                        <p className="py-0.5 max-w-60 truncate">{currentUser?.email}</p>
                    )}
                </div>
                <div className="flex mt-4 gap-2">
                    {editMode ? (
                        <>
                            <Button
                                onClick={handleEdit}
                                color="primary"
                                type="button"
                                isLoading={mutation.isPending}
                                disabled={!isEmpty(errors) || !isDirty || mutation.isPending}
                            >
                                Save
                            </Button>
                            <Button color="danger" onClick={onCancel} disabled={mutation.isPending}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button color="primary" onClick={toggleEditMode}>
                            Edit
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default UserInformation;
