"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import { APP_ROUTES } from "@/constants/routes";
import {
    signInWithEmail,
    signOut,
} from "@/features/auth/services/auth-service";
import { getRoleBasedRedirect } from "@/lib/auth/redirect-utils";
import { authClient } from "@/lib/auth/auth-client";
import type { UserRole } from "@/types/auth-types";
import {
    signInSchema,
    type SignInFormValues,
} from "@/features/auth/schemas/auth-schema";

function SignInFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const requestedRedirect = searchParams.get("redirectTo");

    useEffect(() => {
        if (searchParams.get("error") === "blocked") {
            toast.error("Your account has been blocked. Please contact support.");
        }
    }, [searchParams]);

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: SignInFormValues) => {
        try {
            const result = await signInWithEmail(values);

            if (result.error) {
                const message = result.error.message || "Login failed.";

                if (message.toLowerCase().includes("block")) {
                    toast.error(
                        "Your account has been blocked. Please contact support."
                    );
                    return;
                }

                toast.error(message);
                return;
            }

            const { data: session, error: sessionError } =
                await authClient.getSession();

            if (sessionError || !session?.user) {
                toast.error(
                    "Signed in, but your session could not be verified. Please try again."
                );
                return;
            }

            if (session.user.isBlocked) {
                await signOut();
                router.replace(`${APP_ROUTES.SIGN_IN}?error=blocked`);
                return;
            }

            const role = session.user.role as UserRole | undefined;

            toast.success("Welcome back to PizzaHub!");
            router.push(getRoleBasedRedirect(role, requestedRedirect));
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...form.register("email")}
                />
                <p className="text-sm text-destructive">
                    {form.formState.errors.email?.message}
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...form.register("password")}
                />
                <p className="text-sm text-destructive">
                    {form.formState.errors.password?.message}
                </p>
            </div>

            <Button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red/90"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
        </form>
    );
}

function SignInFormFallback() {
    return (
        <div className="space-y-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
}

export function SignInForm() {
    return (
        <Suspense fallback={<SignInFormFallback />}>
            <SignInFormContent />
        </Suspense>
    );
}
