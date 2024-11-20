import { Icon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";

import Logo from "/assets/images/fastapi-logo.svg";
import type { Body_login_login_access_token as AccessToken } from "../client";
import useAuth, { isLoggedIn } from "../hooks/useAuth";
import { emailPattern } from "../utils";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/login")({
    component: Login,
    beforeLoad: async () => {
        if (isLoggedIn()) {
            throw redirect({
                to: "/",
            });
        }
    },
});

function Login() {
    const [show, setShow] = useState<boolean>(false);
    const { loginMutation, error, resetError } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AccessToken>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<AccessToken> = async (data) => {
        if (isSubmitting) return;

        resetError();

        try {
            await loginMutation.mutateAsync(data);
        } catch {
            // error is handled by useAuth hook
        }
    };

    return (
        <>
            <div className="flex h-screen">
                <form className="max-w-2xl space-y-4 m-auto shadow-xl p-8 rounded-lg bg-content1" onSubmit={handleSubmit(onSubmit)}>
                    <img className="max-w-20 m-auto mb-4 h-auto" src={Logo} alt="FastAPI logo" />
                    <FormControl id="username">
                        <Input
                            id="username"
                            {...register("username", {
                                required: "Username is required",
                                pattern: emailPattern,
                            })}
                            placeholder="Email"
                            type="email"
                            required
                            error={errors.username?.message}
                        />
                    </FormControl>
                    <FormControl id="password">
                        <Input
                            {...register("password", {
                                required: "Password is required",
                            })}
                            type={show ? "text" : "password"}
                            placeholder="Password"
                            required
                            endContent={
                                <Icon
                                    as={show ? ViewOffIcon : ViewIcon}
                                    onClick={() => setShow(!show)}
                                    aria-label={show ? "Hide password" : "Show password"}
                                >
                                    {show ? <ViewOffIcon /> : <ViewIcon />}
                                </Icon>
                            }
                            error={error}
                        />
                    </FormControl>
                    <Link to="/recover-password" className="text-blue-500 text-xs">
                        Forgot password?
                    </Link>
                    <Button className="block w-full" color="primary" type="submit" isLoading={isSubmitting}>
                        Log In
                    </Button>
                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-500">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}
