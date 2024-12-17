import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, Label } from "@/components/ui/label";
import useCustomToast from "@/hooks/useCustomToast";
import { type UserCreate, UsersService } from "../../client";
import type { ApiError } from "../../client/core/ApiError";
import { emailPattern, handleError, isEmpty } from "../../utils";
import { Modal } from "../modal";

interface AddUserProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserCreateForm extends UserCreate {
    confirm_password: string;
}

const AddUser = ({ isOpen, onClose }: AddUserProps) => {
    const queryClient = useQueryClient();
    const showToast = useCustomToast();
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isDirty },
    } = useForm<UserCreateForm>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            confirm_password: "",
            is_superuser: false,
            is_active: false,
        },
    });

    const mutation = useMutation({
        mutationFn: (data: UserCreate) => UsersService.createUser({ requestBody: data }),
        onSuccess: () => {
            showToast.success("Success!", "User created successfully.");
            reset();
            onClose();
        },
        onError: (err: ApiError) => {
            handleError(err, showToast);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const onSubmit: SubmitHandler<UserCreateForm> = (data) => {
        mutation.mutate(data);
    };

    return (
        <>
            {isOpen && (
                <Modal onClose={onClose}>
                    <div className="mx-auto w-full p-8">
                        <div>
                            <h2 className="text-lg font-semibold leading-6 text-default-800">Add User</h2>
                            <form className="w-full mt-2" onSubmit={handleSubmit(onSubmit)}>
                                <FormControl>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: emailPattern,
                                        })}
                                        placeholder="Email"
                                        type="email"
                                        error={errors.email?.message}
                                    />
                                </FormControl>
                                <FormControl className="mt-1">
                                    <Label htmlFor="first_name">Firstname</Label>
                                    <Input id="first_name" {...register("first_name")} type="text" placeholder="John" />
                                </FormControl>
                                <FormControl className="mt-1">
                                    <Label htmlFor="last_name">Lastname</Label>
                                    <Input id="last_name" {...register("last_name")} type="text" placeholder="Doe" />
                                </FormControl>
                                <FormControl className="mt-1">
                                    <Label htmlFor="password">Set Password</Label>
                                    <Input
                                        id="password"
                                        {...register("password", {
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters",
                                            },
                                        })}
                                        placeholder="Password"
                                        type="password"
                                    />
                                </FormControl>
                                <FormControl className="mt-1">
                                    <Label htmlFor="confirm_password">Confirm Password</Label>
                                    <Input
                                        id="confirm_password"
                                        {...register("confirm_password", {
                                            validate: (value) => value === getValues().password || "The passwords do not match",
                                        })}
                                        placeholder="Password"
                                        type="password"
                                    />
                                </FormControl>
                                <div>
                                    <input id="is_superuser" type="checkbox" {...register("is_superuser")} />
                                    <label htmlFor="is_superuser">Is superuser?</label>
                                </div>
                                <div>
                                    <input id="is_active" type="checkbox" {...register("is_active")} />
                                    <label htmlFor="is_active">Is active?</label>
                                </div>
                                <div className="flex justify-end gap-2 mt-8">
                                    <Button className="min-w-32" onClick={onClose} disabled={mutation.isPending}>
                                        Cancel
                                    </Button>
                                    <Button
                                        className="min-w-32"
                                        color="primary"
                                        type="submit"
                                        disabled={!isEmpty(errors) || !isDirty || mutation.isPending}
                                        isLoading={mutation.isPending}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            )}
            {/* <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }} isCentered>
                <ModalOverlay />
                <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>Add User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isRequired isInvalid={!!errors.email}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input
                                id="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: emailPattern,
                                })}
                                placeholder="Email"
                                type="email"
                            />
                            {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.first_name}>
                            <FormLabel htmlFor="name">First name</FormLabel>
                            <Input id="name" {...register("first_name")} placeholder="First name" type="text" />
                            {errors.first_name && <FormErrorMessage>{errors.first_name.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.last_name}>
                            <FormLabel htmlFor="name">Last name</FormLabel>
                            <Input id="name" {...register("last_name")} placeholder="Last name" type="text" />
                            {errors.last_name && <FormErrorMessage>{errors.last_name.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl mt={4} isRequired isInvalid={!!errors.password}>
                            <FormLabel htmlFor="password">Set Password</FormLabel>
                            <Input
                                id="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                                placeholder="Password"
                                type="password"
                            />
                            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl mt={4} isRequired isInvalid={!!errors.confirm_password}>
                            <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
                            <Input
                                id="confirm_password"
                                {...register("confirm_password", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === getValues().password || "The passwords do not match",
                                })}
                                placeholder="Password"
                                type="password"
                            />
                            {errors.confirm_password && <FormErrorMessage>{errors.confirm_password.message}</FormErrorMessage>}
                        </FormControl>
                        <Flex mt={4}>
                            <FormControl>
                                <Checkbox {...register("is_superuser")} colorScheme="teal">
                                    Is superuser?
                                </Checkbox>
                            </FormControl>
                            <FormControl>
                                <Checkbox {...register("is_active")} colorScheme="teal">
                                    Is active?
                                </Checkbox>
                            </FormControl>
                        </Flex>
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button color="primary" type="submit" isLoading={mutation.isPending}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal> */}
        </>
    );
};

export default AddUser;
