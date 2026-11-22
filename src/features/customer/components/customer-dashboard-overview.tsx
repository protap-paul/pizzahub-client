"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Ban,
    CheckCircle2,
    Clock,
    ShoppingBag,
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

import { getCustomerDashboardStats } from "@/features/dashboard/services/dashboard-service";
import type { CustomerDashboardStats } from "@/types/dashboard-types";

export function CustomerDashboardOverview() {
    const [stats, setStats] = useState<CustomerDashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isActive = true;

        async function fetchStats() {
            try {
                const response = await getCustomerDashboardStats();

                if (isActive) setStats(response.stats);
            } catch (error) {
                if (isActive) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load dashboard statistics."
                    );
                }
            } finally {
                if (isActive) setIsLoading(false);
            }
        }

        void fetchStats();

        return () => {
            isActive = false;
        };
    }, []);

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Customer Dashboard"
                title="Welcome Back!"
                description="Track your orders and enjoy your favorite pizzas."
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    label="Total Orders"
                    value={stats?.totalOrders ?? 0}
                    icon={ShoppingBag}
                    accent="text-blue-600"
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
                    icon={CheckCircle2}
                    accent="text-green-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Rejected Orders"
                    value={stats?.rejectedOrders ?? 0}
                    icon={XCircle}
                    accent="text-red-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Cancelled Orders"
                    value={stats?.cancelledOrders ?? 0}
                    icon={Ban}
                    accent="text-gray-600"
                    isLoading={isLoading}
                />
            </div>

            <DashboardChart
                title="Your Order Activity"
                description="A quick view of your order statuses"
                isLoading={isLoading}
                data={[
                    { label: "Pending", value: stats?.pendingOrders ?? 0 },
                    { label: "Accepted", value: stats?.acceptedOrders ?? 0 },
                    { label: "Rejected", value: stats?.rejectedOrders ?? 0 },
                    { label: "Cancelled", value: stats?.cancelledOrders ?? 0 },
                ]}
            />

            <Card className="overflow-hidden border-brand-red/20 bg-gradient-to-r from-brand-red/5 to-brand-orange/10">
                <CardContent className="flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <h2 className="text-xl font-bold">Hungry for more?</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Explore our menu and discover your next favorite pizza.
                        </p>
                    </div>

                    <Button
                        render={<Link href="/menu" />}
                        className="bg-brand-red hover:bg-brand-red/90"
                    >
                        Explore Menu
                        <ArrowRight className="ml-2 size-4" />
                    </Button>
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
                <Button
                    variant="outline"
                    render={<Link href="/dashboard/customer/orders" />}
                >
                    View My Orders
                </Button>

                <Button
                    variant="outline"
                    render={<Link href="/dashboard/customer/favorites" />}
                >
                    My Favorites
                </Button>
            </div>
        </section>
    );
}
