"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { APP_ROUTES, getDashboardPath } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "@/features/auth/services/auth-service";
import type { UserRole } from "@/types/auth-types";
import { useAuth } from "../hooks";

interface AuthGuardProps {
    children: ReactNode;
    requiredRole?: UserRole;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading, isAuthenticated } = useAuth();

    const role = user?.role as UserRole | undefined;
    const hasRoleMismatch = Boolean(requiredRole && role !== requiredRole);

    useEffect(() => {
        if (isLoading) return;

        const redirectTo = encodeURIComponent(pathname);

        if (!isAuthenticated || !user) {
            router.replace(
                `${APP_ROUTES.SIGN_IN}?redirectTo=${redirectTo}`
            );
            return;
        }

        if (user.isBlocked) {
            void signOut().finally(() => {
                router.replace(
                    `${APP_ROUTES.SIGN_IN}?error=blocked&redirectTo=${redirectTo}`
                );
            });
            return;
        }

        if (requiredRole && role !== requiredRole) {
            router.replace(getDashboardPath(role));
        }
    }, [
        isLoading,
        isAuthenticated,
        pathname,
        requiredRole,
        role,
        router,
        user,
    ]);

    if (
        isLoading ||
        !isAuthenticated ||
        !user ||
        user.isBlocked ||
        hasRoleMismatch
    ) {
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
