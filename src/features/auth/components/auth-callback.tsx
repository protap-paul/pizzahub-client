"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import { useAuth } from "@/features/auth/hooks";
import { signOut } from "@/features/auth/services/auth-service";
import { getRoleBasedRedirect } from "@/lib/auth/redirect-utils";
import type { UserRole } from "@/types/auth-types";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return;

        const authError = searchParams.get("error");

        if (authError || !user) {
            toast.error("Google sign-in could not be completed.");
            return;
        }

        if (user.isBlocked) {
            void signOut().finally(() => {
                toast.error("Your account has been blocked.");
                router.replace(`${APP_ROUTES.SIGN_IN}?error=blocked`);
            });
            return;
        }

        const role = user.role as UserRole | undefined;

        toast.success("Successfully signed in with Google!");
        router.replace(
            getRoleBasedRedirect(role, searchParams.get("redirectTo"))
        );
        router.refresh();
    }, [isLoading, router, searchParams, user]);

    const hasError = Boolean(searchParams.get("error"));

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-cream px-4 dark:bg-background">
            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-orange/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center text-center">
                {hasError || (!isLoading && !user) ? (
                    <>
                        <h1 className="text-2xl font-extrabold">
                            Sign-in could not be completed
                        </h1>
                        <p className="mt-2 max-w-md text-muted-foreground">
                            Please try again or contact support if the problem
                            continues.
                        </p>
                        <Button
                            className="mt-6 bg-brand-red hover:bg-brand-red/90"
                            render={<Link href={APP_ROUTES.SIGN_IN} />}
                        >
                            Back to Sign In
                        </Button>
                    </>
                ) : (
                    <>
                        <Loader2 className="size-10 animate-spin text-brand-red" />
                        <h1 className="mt-6 text-2xl font-extrabold">
                            Finishing your sign-in
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Taking you to the right dashboard...
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}

function AuthCallbackFallback() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-10 animate-spin text-brand-red" />
                <p className="text-muted-foreground">Finishing sign-in...</p>
            </div>
        </main>
    );
}

export function AuthCallback() {
    return (
        <Suspense fallback={<AuthCallbackFallback />}>
            <AuthCallbackContent />
        </Suspense>
    );
}
