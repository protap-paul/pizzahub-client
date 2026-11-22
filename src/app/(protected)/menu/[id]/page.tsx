
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { MenuDetails } from "@/features/menu/components";
import { getMenuItemById } from "@/features/menu/services/menu-service";
import { useAuth } from "@/features/auth/hooks";

import { Skeleton } from "@/components/ui/skeleton";
import type { MenuItem } from "@/types/menu-types";

function MenuDetailsFallback() {
    return (
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-12">
            <Skeleton className="h-10 w-2/3" />
            <div className="grid gap-8 lg:grid-cols-2">
                <Skeleton className="h-[400px] rounded-2xl" />
                <div className="space-y-5">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        </main>
    );
}

function MenuDetailsContent() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const { isLoading: isAuthLoading, isAuthenticated } = useAuth();

    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuthLoading) return;

        if (!isAuthenticated) {
            // Store the current URL so we can redirect back after sign-in
            router.replace(`/sign-in?redirectTo=/menu/${params.id}`);
            return;
        }

        let isActive = true;

        async function fetchMenuItem() {
            try {
                setIsLoading(true);
                setError("");

                const response = await getMenuItemById(params.id);

                if (isActive) {
                    setMenuItem(response.menuItem);
                }
            } catch (err) {
                if (isActive) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load pizza details."
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        void fetchMenuItem();

        return () => {
            isActive = false;
        };
    }, [params.id, isAuthLoading, isAuthenticated, router]);

    if (isAuthLoading || (!isAuthenticated && !error)) {
        return <MenuDetailsFallback />;
    }

    if (!isAuthenticated) return null;

    if (isLoading) {
        return <MenuDetailsFallback />;
    }

    if (error || !menuItem) {
        return (
            <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold">
                    {error || "Pizza not found!"}
                </h1>

                <p className="mt-2 text-muted-foreground">
                    This pizza may have been removed or is currently unavailable.
                </p>

                <Link
                    href="/menu"
                    className="mt-6 rounded-lg bg-brand-red px-6 py-3 font-semibold text-white hover:bg-brand-red/90"
                >
                    Back to Menu
                </Link>
            </main>
        );
    }

    return (
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <MenuDetails item={menuItem} />
        </main>
    );
}

export default function MenuDetailsPage() {
    return (
        <Suspense fallback={<MenuDetailsFallback />}>
            <MenuDetailsContent />
        </Suspense>
    );
}
