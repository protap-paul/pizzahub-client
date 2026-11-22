"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    ClipboardList,
    CreditCard,
    LayoutDashboard,
    Pizza,
    RefreshCw,
    ShieldCheck,
    UsersRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DashboardChart,
    PageHeader,
    StatCard,
} from "@/features/dashboard/components";
import { getAdminDashboardStats } from "@/features/dashboard/services/dashboard-service";
import type { AdminDashboardStats } from "@/types/dashboard-types";

export function AdminDashboardOverview() {
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStats = useCallback(async (refresh = false) => {
        try {
            if (refresh) setIsRefreshing(true);
            else setIsLoading(true);

            const response = await getAdminDashboardStats();
            setStats(response.stats);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load admin statistics."
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        // Defer the initial fetch so the loading state is not set synchronously
        // during the effect (React's set-state-in-effect rule).
        void Promise.resolve().then(() => fetchStats());
    }, [fetchStats]);

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Admin Workspace"
                title="Platform Overview"
                description="Monitor users, menu submissions, orders, and subscription revenue."
                action={
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
                }
            />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                <StatCard
                    label="Total Users"
                    value={stats?.totalUsers ?? 0}
                    icon={UsersRound}
                    isLoading={isLoading}
                />
                <StatCard
                    label="Customers"
                    value={stats?.totalCustomers ?? 0}
                    icon={LayoutDashboard}
                    accent="text-blue-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Vendors"
                    value={stats?.totalVendors ?? 0}
                    icon={ShieldCheck}
                    accent="text-orange-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Transactions"
                    value={stats?.totalTransactions ?? 0}
                    icon={CreditCard}
                    accent="text-emerald-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Total Menu Items"
                    value={stats?.totalMenuItems ?? 0}
                    icon={Pizza}
                    accent="text-orange-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Pending Review"
                    value={stats?.pendingMenuItems ?? 0}
                    icon={ClipboardList}
                    accent="text-amber-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Total Orders"
                    value={stats?.totalOrders ?? 0}
                    icon={ClipboardList}
                    accent="text-blue-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Pending Orders"
                    value={stats?.pendingOrders ?? 0}
                    icon={ClipboardList}
                    accent="text-amber-600"
                    isLoading={isLoading}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <DashboardChart
                    title="Registered Accounts"
                    description="Customer and vendor distribution"
                    isLoading={isLoading}
                    data={[
                        {
                            label: "Customers",
                            value: stats?.totalCustomers ?? 0,
                        },
                        { label: "Vendors", value: stats?.totalVendors ?? 0 },
                    ]}
                />

                <DashboardChart
                    title="Platform Activity"
                    description="Menu items and orders currently on PizzaHub"
                    type="pie"
                    isLoading={isLoading}
                    data={[
                        {
                            label: "Menu Items",
                            value: stats?.totalMenuItems ?? 0,
                        },
                        { label: "Orders", value: stats?.totalOrders ?? 0 },
                        {
                            label: "Transactions",
                            value: stats?.totalTransactions ?? 0,
                        },
                    ]}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    {
                        title: "Manage Users",
                        description: "Review accounts and block misuse.",
                        href: "/dashboard/admin/users",
                        icon: UsersRound,
                    },
                    {
                        title: "Review Menu Items",
                        description: "Approve, reject, or remove listings.",
                        href: "/dashboard/admin/menu-items",
                        icon: Pizza,
                    },
                    {
                        title: "Transactions",
                        description: "Read-only premium payment records.",
                        href: "/dashboard/admin/transactions",
                        icon: CreditCard,
                    },
                ].map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card key={item.href}>
                            <CardContent className="space-y-4 p-6">
                                <Icon className="size-7 text-brand-red" />
                                <div>
                                    <h2 className="font-semibold">{item.title}</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                                <Button
                                    render={<Link href={item.href} />}
                                    variant="outline"
                                >
                                    Open
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
