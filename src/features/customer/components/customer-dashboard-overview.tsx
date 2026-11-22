
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ShoppingBag,
    Clock,
    CheckCircle2,
    XCircle,
    Ban,
    ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getCustomerDashboardStats } from "@/features/dashboard/services/dashboard-service";
import type { CustomerDashboardStats } from "@/types/dashboard-types";

const statCards = [
    {
        key: "totalOrders",
        title: "Total Orders",
        icon: ShoppingBag,
        color: "text-blue-600",
        bg: "bg-blue-500/10",
    },
    {
        key: "pendingOrders",
        title: "Pending Orders",
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-500/10",
    },
    {
        key: "acceptedOrders",
        title: "Accepted Orders",
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-500/10",
    },
    {
        key: "rejectedOrders",
        title: "Rejected Orders",
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-500/10",
    },
    {
        key: "cancelledOrders",
        title: "Cancelled Orders",
        icon: Ban,
        color: "text-gray-600",
        bg: "bg-gray-500/10",
    },
] as const;

export function CustomerDashboardOverview() {
    const [stats, setStats] = useState<CustomerDashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isActive = true;

        async function fetchStats() {
            try {
                const response = await getCustomerDashboardStats();

                if (isActive) {
                    setStats(response.stats);
                }
            } catch (error) {
                if (isActive) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load dashboard statistics.",
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        fetchStats();

        return () => {
            isActive = false;
        };
    }, []);

    return (
        <section className="space-y-8">
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-red">
                    Customer Dashboard
                </p>

                <h1 className="mt-2 text-3xl font-extrabold">
                    Welcome Back!
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Track your orders and enjoy your favorite pizzas.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {statCards.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <Card key={stat.key} className="border-border/70 shadow-sm">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className={`rounded-xl p-3 ${stat.bg}`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {stat.title}
                                    </p>

                                    {isLoading ? (
                                        <Skeleton className="mt-2 h-8 w-16" />
                                    ) : (
                                        <p className="mt-1 text-2xl font-extrabold">
                                            {stats?.[stat.key] ?? 0}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="overflow-hidden border-brand-red/20 bg-gradient-to-r from-brand-red/5 to-brand-orange/10">
                <CardContent className="flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <h2 className="text-xl font-bold">
                            Hungry for more?
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Explore our menu and discover your next favorite pizza.
                        </p>
                    </div>

                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-red/90"
                    >
                        Explore Menu
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
                <Link
                    href="/dashboard/customer/orders"
                    className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                >
                    View My Orders
                </Link>

                <Link
                    href="/profile"
                    className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                >
                    Manage Profile
                </Link>
            </div>
        </section>
    );
}
