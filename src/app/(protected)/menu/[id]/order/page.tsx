
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { OrderForm } from "@/features/orders/components";
import { getMenuItemById } from "@/features/menu/services/menu-service";
import { useAuth } from "@/features/auth/hooks";

import { Skeleton } from "@/components/ui/skeleton";
import type { MenuItem } from "@/types/menu-types";

function OrderPageFallback() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-12">
            <Skeleton className="mx-auto h-[500px] max-w-2xl rounded-2xl" />
        </main>
    );
}

function OrderPageContent() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const { isLoading: isAuthLoading, isAuthenticated } = useAuth();

    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuthLoading) return;

        if (!isAuthenticated) {
            router.replace("/sign-in");
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
                            : "Failed to load pizza information."
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        fetchMenuItem();

        return () => {
            isActive = false;
        };
    }, [params.id, isAuthLoading, isAuthenticated, router]);

    if (isAuthLoading || (!isAuthenticated && !error)) {
        return <OrderPageFallback />;
    }

    if (!isAuthenticated) return null;

    if (isLoading) {
        return <OrderPageFallback />;
    }

    if (error || !menuItem) {
        return (
            <main className="mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold">
                    {error || "Pizza not found!"}
                </h1>

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
            <div className="mb-8 text-center">
                <span className="text-sm font-bold uppercase tracking-widest text-brand-red">
                    Almost There!
                </span>

                <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                    Order Your{" "}
                    <span className="text-brand-red">Favorite Pizza</span>
                </h1>

                <p className="mt-3 text-muted-foreground">
                    Complete your delivery information and enjoy your pizza.
                </p>
            </div>

            <OrderForm item={menuItem} />
        </main>
    );
}

export default function OrderPage() {
    return (
        <Suspense fallback={<OrderPageFallback />}>
            <OrderPageContent />
        </Suspense>
    );
}
