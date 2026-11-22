
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signUpWithEmail } from "@/features/auth/services/auth-service";
import { getRoleBasedRedirect } from "@/lib/auth/redirect-utils";
import {
    signUpSchema,
    type SignUpFormValues,
} from "@/features/auth/schemas/auth-schema";

export function SignUpForm() {
    const router = useRouter();

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "customer",
            businessName: "",
            image: "",
        },
    });

    // React Hook Form's watch() is intentionally not memoized by React
    // Compiler; the selected role only drives conditional field rendering.
    // eslint-disable-next-line react-hooks/incompatible-library
    const selectedRole = form.watch("role");

    const onSubmit = async (values: SignUpFormValues) => {
        try {
            const result = await signUpWithEmail(values);

            if (result.error) {
                toast.error(result.error.message || "Registration failed.");
                return;
            }

            toast.success("Your account has been created successfully.");
            router.push(getRoleBasedRedirect(values.role));
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...form.register("name")}
                />
                <p className="text-sm text-destructive">
                    {form.formState.errors.name?.message}
                </p>
            </div>

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
                    placeholder="Create a strong password"
                    {...form.register("password")}
                />
                <p className="text-sm text-destructive">
                    {form.formState.errors.password?.message}
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Profile Image (Optional)</Label>
                <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/your-photo.jpg"
                    {...form.register("image")}
                />
                <p className="text-xs text-muted-foreground">
                    Paste a public image URL, or leave blank to use your initials.
                </p>
                <p className="text-sm text-destructive">
                    {form.formState.errors.image?.message}
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <select
                    id="role"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...form.register("role")}
                >
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                </select>
            </div>

            {selectedRole === "vendor" && (
                <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                        id="businessName"
                        placeholder="Enter your pizza business name"
                        {...form.register("businessName")}
                    />
                    <p className="text-sm text-destructive">
                        {form.formState.errors.businessName?.message}
                    </p>
                </div>
            )}

            <Button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red/90"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting
                    ? "Creating Account..."
                    : "Create Account"}
            </Button>
        </form>
    );
}
