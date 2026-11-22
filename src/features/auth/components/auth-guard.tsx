
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "../hooks";

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const { isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace(APP_ROUTES.SIGN_IN);
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
            </div>
        );
    }

    return <>{children}</>;
}
