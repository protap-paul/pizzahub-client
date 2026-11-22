"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    Clock,
    ClipboardList,
    Crown,
    PackageCheck,
    Pizza,
    RefreshCw,
    XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DashboardChart,
    PageHeader,
    StatCard,
} from "@/features/dashboard/components";
import { getVendorDashboardStats } from "@/features/dashboard/services/dashboard-service";
import { getMyProfile } from "@/features/profile/services/profile-service";
import { formatDate } from "@/lib/formatters";
import type { VendorDashboardStats } from "@/types/dashboard-types";
import type { SubscriptionPlan } from "@/types/auth-types";

export function VendorDashboardOverview() {
    const [stats, setStats] = useState<VendorDashboardStats | null>(null);
    const [plan, setPlan] = useState<SubscriptionPlan>("free");
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = useCallback(async (refresh = false) => {
        try {
            if (refresh) setIsRefreshing(true);
            else setIsLoading(true);

            const [statsResponse, profileResponse] = await Promise.all([
                getVendorDashboardStats(),
                getMyProfile(),
            ]);

            setStats(statsResponse.stats);
            setPlan(profileResponse.user.subscriptionPlan ?? "free");
            setExpiresAt(profileResponse.user.subscriptionExpiresAt ?? null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load dashboard statistics."
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(() => fetchData());
    }, [fetchData]);

    const isPremium = plan === "premium";

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Vendor Workspace"
                title="Vendor Dashboard"
                description="Manage your pizzas, track orders, and grow your business."
                action={
                    <Button
                        variant="outline"
                        onClick={() => void fetchData(true)}
                        disabled={isLoading || isRefreshing}
                    >
                        <RefreshCw
                            className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                }
            />

            <Card className="overflow-hidden border-brand-red/20 bg-gradient-to-r from-brand-red/10 via-brand-orange/10 to-transparent">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red text-white">
                            {isPremium ? (
                                <Crown className="size-6" />
                            ) : (
                                <Pizza className="size-6" />
                            )}
                        </span>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Current subscription plan
                            </p>
                            <p className="mt-1 text-2xl font-extrabold capitalize">
                                {plan}
                            </p>
                            {expiresAt && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Active until {formatDate(expiresAt)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                        <p className="text-sm text-muted-foreground">
                            {isPremium
                                ? "Unlimited active menu items and featured placement."
                                : `${stats?.availableMenuItems ?? 0} of 3 active menu items used.`}
                        </p>

                        <Button
                            render={
                                <Link href="/dashboard/vendor/subscription" />
                            }
                            variant={isPremium ? "outline" : "default"}
                            className="bg-brand-red hover:bg-brand-red/90"
                        >
                            {isPremium ? "Manage Subscription" : "Upgrade to Premium"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total Menu Items"
                    value={stats?.totalMenuItems ?? 0}
                    icon={Pizza}
                    isLoading={isLoading}
                />
                <StatCard
                    label="Active Menu Items"
                    value={stats?.approvedMenuItems ?? 0}
                    icon={CheckCircle2}
                    accent="text-green-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Pending Orders"
                    value={stats?.pendingOrders ?? 0}
                    icon={Clock}
                    accent="text-amber-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Accepted Orders"
                    value={stats?.acceptedOrders ?? 0}
                    icon={PackageCheck}
                    accent="text-emerald-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Pending Items"
                    value={stats?.pendingMenuItems ?? 0}
                    icon={Clock}
                    accent="text-amber-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Rejected Items"
                    value={stats?.rejectedMenuItems ?? 0}
                    icon={XCircle}
                    accent="text-red-600"
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
                    label="Available Items"
                    value={stats?.availableMenuItems ?? 0}
                    icon={CheckCircle2}
                    accent="text-green-600"
                    isLoading={isLoading}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <DashboardChart
                    title="Order Status Overview"
                    description="Customer orders at a glance"
                    isLoading={isLoading}
                    data={[
                        { label: "Pending", value: stats?.pendingOrders ?? 0 },
                        { label: "Accepted", value: stats?.acceptedOrders ?? 0 },
                        { label: "Rejected", value: stats?.rejectedOrders ?? 0 },
                    ]}
                />

                <DashboardChart
                    title="Menu Review Status"
                    description="How many of your items are approved, pending, or rejected"
                    type="pie"
                    isLoading={isLoading}
                    data={[
                        {
                            label: "Approved",
                            value: stats?.approvedMenuItems ?? 0,
                        },
                        {
                            label: "Pending",
                            value: stats?.pendingMenuItems ?? 0,
                        },
                        {
                            label: "Rejected",
                            value: stats?.rejectedMenuItems ?? 0,
                        },
                    ]}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                    <CardContent className="flex items-center justify-between gap-4 p-6">
                        <div>
                            <h2 className="font-semibold">Manage Menu Items</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Add and manage your pizza menu.
                            </p>
                            <Button
                                render={<Link href="/dashboard/vendor/menu-items" />}
                                className="mt-4 bg-brand-red hover:bg-brand-red/90"
                            >
                                <Pizza className="mr-2 size-4" />
                                My Menu Items
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between gap-4 p-6">
                        <div>
                            <h2 className="font-semibold">Manage Orders</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Review and update customer orders.
                            </p>
                            <Button
                                render={<Link href="/dashboard/vendor/orders" />}
                                variant="outline"
                                className="mt-4"
                            >
                                <ClipboardList className="mr-2 size-4" />
                                View Orders
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
