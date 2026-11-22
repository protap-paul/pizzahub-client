"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuth } from "@/features/auth/hooks";
import {
    getMyProfile,
    updateMyProfile,
} from "@/features/profile/services/profile-service";
import { authClient } from "@/lib/auth/auth-client";
import { formatDate } from "@/lib/formatters";

const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(50, "Name cannot exceed 50 characters."),
    image: z
        .string()
        .trim()
        .refine(
            (value) => value === "" || /^https?:\/\/\S+$/i.test(value),
            "Please enter a valid http(s) image URL."
        ),
    businessName: z
        .string()
        .trim()
        .max(80, "Business name cannot exceed 80 characters.")
        .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function ProfileFormFallback() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
        </div>
    );
}

function ProfileFormContent() {
    const router = useRouter();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [accountDetails, setAccountDetails] = useState<{
        email: string;
        role: string;
        businessName?: string;
        subscriptionPlan?: string;
        createdAt?: string;
        image?: string;
    } | null>(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            image: "",
            businessName: "",
        },
    });

    // React Hook Form's watch() is intentionally not memoized by React
    // Compiler; these values only drive the avatar preview.
    // eslint-disable-next-line react-hooks/incompatible-library
    const imageValue = form.watch("image");
    const nameValue = form.watch("name");

    useEffect(() => {
        let isActive = true;

        async function loadProfile() {
            try {
                const response = await getMyProfile();

                if (!isActive) return;

                setAccountDetails({
                    email: response.user.email,
                    role: response.user.role,
                    businessName: response.user.businessName,
                    subscriptionPlan: response.user.subscriptionPlan,
                    createdAt: response.user.createdAt,
                    image: response.user.image,
                });

                form.reset({
                    name: response.user.name ?? "",
                    image: response.user.image ?? "",
                    businessName: response.user.businessName ?? "",
                });
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to load your profile."
                );
            } finally {
                if (isActive) setIsLoading(false);
            }
        }

        void loadProfile();

        return () => {
            isActive = false;
        };
    }, [form]);

    const onSubmit = async (values: ProfileFormValues) => {
        try {
            setIsSaving(true);

            const payload = {
                name: values.name,
                image: values.image,
                ...(user?.role === "vendor"
                    ? { businessName: values.businessName || "" }
                    : {}),
            };

            const response = await updateMyProfile(payload);

            // Refresh the Better Auth session so the navbar/sidebar show the
            // updated name and image without requiring a manual page reload.
            await authClient.getSession();

            toast.success(response.message || "Profile updated successfully.");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update your profile."
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <ProfileFormFallback />;

    const previewImage = imageValue || accountDetails?.image || user?.image;

    return (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <Card className="h-fit">
                <CardContent className="flex flex-col items-center py-8 text-center">
                    <Avatar className="size-24">
                        {previewImage ? (
                            <AvatarImage src={previewImage} alt={nameValue} />
                        ) : null}
                        <AvatarFallback className="text-2xl">
                            {initials(nameValue || user?.name || "PizzaHub User")}
                        </AvatarFallback>
                    </Avatar>

                    <h2 className="mt-4 text-xl font-bold">{nameValue}</h2>
                    <p className="text-sm text-muted-foreground">
                        {accountDetails?.email || user?.email}
                    </p>

                    <div className="mt-6 w-full space-y-2 border-t pt-6 text-left text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Role</span>
                            <span className="font-semibold capitalize">
                                {accountDetails?.role || user?.role || "-"}
                            </span>
                        </div>

                        {user?.role === "vendor" && (
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">Plan</span>
                                <span className="font-semibold capitalize">
                                    {accountDetails?.subscriptionPlan || "free"}
                                </span>
                            </div>
                        )}

                        {accountDetails?.createdAt && (
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">Joined</span>
                                <span className="font-semibold">
                                    {formatDate(accountDetails.createdAt)}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Update the information customers and vendors see. Your role
                        and subscription cannot be changed here.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter your full name"
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Profile Image URL (Optional)</Label>
                            <Input
                                id="image"
                                type="url"
                                placeholder="https://example.com/photo.jpg"
                                {...form.register("image")}
                            />
                            {form.formState.errors.image && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.image.message}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Leave this empty to use your initials as the avatar.
                            </p>
                        </div>

                        {user?.role === "vendor" && (
                            <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name</Label>
                                <Input
                                    id="businessName"
                                    placeholder="Enter your restaurant name"
                                    {...form.register("businessName")}
                                />
                                {form.formState.errors.businessName && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.businessName.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="bg-brand-red hover:bg-brand-red/90"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 size-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export function ProfileForm() {
    return (
        <section className="space-y-8">
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-red">
                    Account
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
                    Profile Settings
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Keep your PizzaHub account details up to date.
                </p>
            </div>

            <ProfileFormContent />
        </section>
    );
}
