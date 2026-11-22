"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import { signInWithGoogle } from "@/features/auth/services/auth-service";
import { getSafeRedirect } from "@/lib/auth/redirect-utils";

export function GoogleSignInButton() {
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);

            const requestedRedirect = searchParams.get("redirectTo");
            const safeRedirect = getSafeRedirect(requestedRedirect, "");

            const callbackURL = new URL(
                APP_ROUTES.AUTH_CALLBACK,
                window.location.origin
            );

            if (safeRedirect) {
                callbackURL.searchParams.set("redirectTo", safeRedirect);
            }

            const result = await signInWithGoogle(callbackURL.toString());

            if (result.error) {
                toast.error(result.error.message || "Google sign-in failed.");
                setIsLoading(false);
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to sign in with Google."
            );
            setIsLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
        >
            {isLoading ? "Connecting to Google..." : "Continue with Google"}
        </Button>
    );
}
