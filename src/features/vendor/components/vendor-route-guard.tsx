
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

interface VendorRouteGuardProps {
    children: React.ReactNode;
}

export function VendorRouteGuard({
    children,
}: VendorRouteGuardProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.replace("/sign-in");
            return;
        }

        if (user.role !== "vendor") {
            router.replace("/");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== "vendor") {
        return (
            <main className="mx-auto max-w-7xl space-y-4 px-4 py-12">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </main>
        );
    }

    return <>{children}</>;
}
