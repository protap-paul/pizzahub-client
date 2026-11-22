
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/features/auth/services/auth-service";

export function GoogleSignInButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);

            const result = await signInWithGoogle();

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
