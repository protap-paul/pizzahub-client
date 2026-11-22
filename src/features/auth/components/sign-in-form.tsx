
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signInWithEmail } from "@/features/auth/services/auth-service";
import {
    signInSchema,
    type SignInFormValues,
} from "@/features/auth/schemas/auth-schema";

export function SignInForm() {
    const router = useRouter();

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
                toast.error(result.error.message || "Login failed.");
                return;
            }

            toast.success("Welcome back to PizzaHub!");
            router.push("/");
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
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
        >
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
                {form.formState.isSubmitting
                    ? "Signing In..."
                    : "Sign In"}
            </Button>
        </form>
    );
}
