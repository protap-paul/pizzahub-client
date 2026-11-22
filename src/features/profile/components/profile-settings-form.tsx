"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    BadgeCheck,
    Crown,
    Loader2,
    Save,
    Store,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/features/dashboard/components";
import {
    getMyProfile,
    updateMyProfile,
} from "@/features/profile/services/profile-service";
import { formatDate } from "@/lib/formatters";
import type { User } from "@/types/user-types";

const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(50, "Name cannot exceed 50 characters."),
    image: z
        .string()
        .trim()
        .refine((value) => value === "" || isValidUrl(value), {
            message: "Please enter a valid image URL.",
        }),
    businessName: z.string().trim().max(80, "Business name cannot exceed 80 characters."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function isValidUrl(value: string) {
    try {
        const url = new URL(value);

        return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
    } catch {
        return false;
    }
}

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function ProfileSettingsForm() {
    const [profile, setProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            image: "",
            businessName: "",
        },
    });

    const isVendor = profile?.role === "vendor";
    // React Hook Form's watch() is intentionally not memoized by React
    // Compiler; this value only drives the avatar preview.
    // eslint-disable-next-line react-hooks/incompatible-library
    const previewImage = form.watch("image");

    useEffect(() => {
        let isActive = true;

        async function loadProfile() {
            try {
                const response = await getMyProfile();

                if (!isActive) return;

                setProfile(response.user);
                form.reset({
                    name: response.user.name,
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

    async function onSubmit(values: ProfileFormValues) {
        try {
            const response = await updateMyProfile({
                name: values.name,
                ...(values.image ? { image: values.image } : { image: "" }),
                ...(isVendor ? { businessName: values.businessName } : {}),
            });

            toast.success(response.message || "Profile updated successfully.");

            const refreshed = await getMyProfile();
            setProfile(refreshed.user);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update your profile."
            );
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-80 w-full rounded-xl" />
            </div>
        );
    }

    if (!profile) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <h1 className="text-xl font-bold">Profile unavailable</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        We couldn&apos;t load your profile. Please try again later.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Account"
                title="Profile Settings"
                description="Update your personal information. Your role and subscription are managed securely by PizzaHub."
            />

            <Card>
                <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
                    <Avatar className="size-20">
                        {previewImage && isValidUrl(previewImage) ? (
                            <AvatarImage
                                src={previewImage}
                                alt={profile.name}
                            />
                        ) : null}
                        <AvatarFallback className="text-xl">
                            {initials(profile.name || "PizzaHub User")}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-2xl font-bold">{profile.name}</h2>
                            <Badge variant="secondary" className="capitalize">
                                {profile.role}
                            </Badge>
                            {profile.subscriptionPlan === "premium" && (
                                <Badge className="bg-brand-orange text-white">
                                    <Crown className="mr-1 size-3" />
                                    Premium
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {profile.email}
                        </p>
                        {isVendor && profile.businessName && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Store className="size-4 text-brand-red" />
                                {profile.businessName}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Information</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Only the fields below can be changed.
                        </p>
                    </CardHeader>

                    <CardContent>
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
                                {form.formState.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">
                                    Profile Image URL (Optional)
                                </Label>
                                <Input
                                    id="image"
                                    type="url"
                                    placeholder="https://example.com/your-photo.jpg"
                                    {...form.register("image")}
                                />
                                {form.formState.errors.image && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.image.message}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Paste a public image URL. Leave empty to use
                                    your initials.
                                </p>
                            </div>

                            {isVendor && (
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">
                                        Business Name
                                    </Label>
                                    <Input
                                        id="businessName"
                                        placeholder="Your restaurant name"
                                        {...form.register("businessName")}
                                    />
                                    {form.formState.errors.businessName && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors
                                                    .businessName?.message
                                            }
                                        </p>
                                    )}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="bg-brand-red hover:bg-brand-red/90"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
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

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Email</span>
                                <span className="max-w-40 truncate font-medium">
                                    {profile.email}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Role</span>
                                <span className="font-medium capitalize">
                                    {profile.role}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Plan</span>
                                <span className="font-medium capitalize">
                                    {profile.subscriptionPlan ?? "free"}
                                </span>
                            </div>
                            {profile.createdAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Member since
                                    </span>
                                    <span className="font-medium">
                                        {formatDate(profile.createdAt)}
                                    </span>
                                </div>
                            )}
                            {profile.subscriptionExpiresAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Plan ends
                                    </span>
                                    <span className="font-medium">
                                        {formatDate(profile.subscriptionExpiresAt)}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-brand-red/20 bg-brand-red/5">
                        <CardContent className="flex gap-3 p-5">
                            <BadgeCheck className="size-5 shrink-0 text-brand-red" />
                            <p className="text-sm text-muted-foreground">
                                Your role and subscription status are protected
                                and can only be changed through secure platform
                                actions.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
