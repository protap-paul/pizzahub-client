"use client";

import { authClient } from "@/lib/auth/auth-client";

export function useAuth() {
    const session = authClient.useSession();

    return {
        user: session.data?.user ?? null,
        session: session.data ?? null,
        isLoading: session.isPending,
        isAuthenticated: !!session.data?.user,
    };
}