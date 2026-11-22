
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    Pizza,
    CheckCircle2,
    Clock,
    XCircle,
    ShoppingBag,
    PackageCheck,
    Plus,
    ClipboardList,
    RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getVendorDashboardStats } from "@/features/dashboard/services/dashboard-service";
import type { VendorDashboardStats } from "@/types/dashboard-types";

const statItems = [
    {
        key: "totalMenuItems",
        label: "Total Menu Items",
        icon: Pizza,
        color: "text-orange-600",
    },
    {
        key: "approvedMenuItems",
        label: "Approved Items",
        icon: CheckCircle2,
        color: "text-green-600",
    },
    {
        key: "pendingMenuItems",
        label: "Pending Items",
        icon: Clock,
        color: "text-amber-600",
    },
    {
        key: "rejectedMenuItems",
        label: "Rejected Items",
        icon: XCircle,
        color: "text-red-600",
    },
    {
        key: "totalOrders",
        label: "Total Orders",
        icon: ShoppingBag,
        color: "text-blue-600",
    },
    {
        key: "pendingOrders",
        label: "Pending Orders",
        icon: Clock,
        color: "text-amber-600",
    },
    {
        key: "acceptedOrders",
        label: "Accepted Orders",
        icon: PackageCheck,
        color: "text-green-600",
    },
    {
        key: "rejectedOrders",
        label: "Rejected Orders",
        icon: XCircle,
        color: "text-red-600",
    },
] as const;

export function VendorDashboardOverview() {
    const [stats, setStats] = useState<VendorDashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStats = useCallback(async (refresh = false) => {
        try {
            if (refresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const response = await getVendorDashboardStats();
            setStats(response.stats);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load dashboard statistics.",
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void fetchStats();
    }, [fetchStats]);

    return (
        <section className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-brand-red">
                        Vendor Workspace
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight">
                        Vendor Dashboard
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage your pizzas, track orders, and grow your business.
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={() => void fetchStats(true)}
                    disabled={isLoading || isRefreshing}
                >
                    <RefreshCw
                        className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index}>
                            <CardContent className="space-y-3 p-6">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-9 w-20" />
                            </CardContent>
                        </Card>
                    ))
                    : statItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Card key={item.key}>
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {item.label}
                                        </p>
                                        <p className="mt-2 text-3xl font-bold">
                                            {stats?.[item.key] ?? 0}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-muted p-3">
                                        <Icon className={`size-6 ${item.color}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                    <CardContent className="flex items-center justify-between gap-4 p-6">
                        <div>
                            <h2 className="font-semibold">Manage Menu Items</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Add and manage your pizza menu.
                            </p>
                            <Link
                                href="/dashboard/vendor/menu-items"
                                className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                            >
                                <Pizza className="mr-2 size-4" />
                                My Menu Items
                            </Link>
                        </div>
                        <Plus className="size-10 text-brand-red" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between gap-4 p-6">
                        <div>
                            <h2 className="font-semibold">Manage Orders</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Review and update customer orders.
                            </p>
                            <Link
                                href="/dashboard/vendor/orders"
                                className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                <ClipboardList className="mr-2 size-4" />
                                View Orders
                            </Link>
                        </div>
                        <ShoppingBag className="size-10 text-brand-orange" />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
