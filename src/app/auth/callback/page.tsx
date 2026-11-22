import type { Metadata } from "next";

import { AuthCallback } from "@/features/auth/components";

export const metadata: Metadata = {
    title: "Completing Sign In",
};

export default function AuthCallbackPage() {
    return <AuthCallback />;
}
