"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, CheckCircle2, Clock, MapPin, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import { PageHeader } from "@/features/dashboard/components";
import {
    getVendorOrders,
    updateVendorOrderStatus,
} from "@/features/orders/services/vendor-order-service";
import { getMyMenuItems } from "@/features/menu/services/vendor-menu-service";
import { formatDate, formatDateTime } from "@/lib/formatters";
import type { MenuItem } from "@/types/menu-types";
import type { Order, OrderStatus } from "@/types/order-types";

const statusStyles: Record<OrderStatus, string> = {
    pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    accepted: "bg-green-500/10 text-green-700 border-green-500/20",
    rejected: "bg-red-500/10 text-red-700 border-red-500/20",
    cancelled: "bg-gray-500/10 text-gray-700 border-gray-500/20",
};

async function fetchAllVendorMenuItems() {
    const firstPage = await getMyMenuItems(1, 50);
    const allItems = [...firstPage.menuItems];

    for (let currentPage = 2; currentPage <= firstPage.pagination.totalPages; currentPage += 1) {
        const response = await getMyMenuItems(currentPage, 50);
        allItems.push(...response.menuItems);
    }

    return allItems;
}

export function VendorOrdersList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [items, setItems] = useState<Record<string, MenuItem>>({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchOrders = useCallback(async (refresh = false) => {
        try {
            if (refresh) setIsRefreshing(true);
            else setIsLoading(true);

            const [orderResponse, menuItems] = await Promise.all([
                getVendorOrders(page, 10),
                fetchAllVendorMenuItems(),
            ]);

            setOrders(orderResponse.orders);
            setTotalPages(orderResponse.pagination.totalPages);
            setItems(
                Object.fromEntries(
                    menuItems.map((item) => [item._id, item])
                )
            );
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to load orders."
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [page]);

    useEffect(() => {
        void Promise.resolve().then(() => fetchOrders());
    }, [fetchOrders]);

    async function handleStatus(orderId: string, status: "accepted" | "rejected") {
        try {
            setActionId(orderId);
            const response = await updateVendorOrderStatus(orderId, { status });
            toast.success(response.message);
            await fetchOrders(true);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to update order."
            );
        } finally {
            setActionId(null);
        }
    }

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Vendor Workspace"
                title="Customer Orders"
                description="Review incoming orders and accept or reject pending requests."
                action={
                    <Button
                        variant="outline"
                        onClick={() => void fetchOrders(true)}
                        disabled={isLoading || isRefreshing}
                    >
                        <RefreshCw
                            className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                }
            />

            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-56 w-full rounded-xl" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Clock className="mx-auto size-12 text-muted-foreground" />
                        <h2 className="mt-4 text-xl font-bold">No orders yet</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            New customer orders will appear here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="space-y-5">
                        {orders.map((order) => {
                            const item = items[order.itemId];

                            return (
                                <Card key={order._id}>
                                    <CardContent className="space-y-5 p-5 sm:p-6">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Order #{order._id.slice(-8)}
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Requested {formatDateTime(order.createdAt)}
                                                </p>
                                            </div>

                                            <Badge
                                                variant="outline"
                                                className={statusStyles[order.status]}
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>

                                        <Separator />

                                        <div className="grid gap-5 md:grid-cols-[auto_1fr]">
                                            <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                                                {item?.images?.[0] ? (
                                                    <Image
                                                        src={item.images[0]}
                                                        alt={item.itemName}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                ) : null}
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Menu Item
                                                    </p>
                                                    <p className="font-semibold">
                                                        {item?.itemName || "Menu item unavailable"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item?.category}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Customer
                                                    </p>
                                                    <p className="font-mono text-xs">
                                                        Customer #{order.customerId.slice(-8)}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <CalendarDays className="mt-0.5 size-4 text-brand-red" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Delivery Date
                                                        </p>
                                                        <p className="font-semibold">
                                                            {formatDate(order.deliveryDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 sm:col-span-2">
                                                    <MapPin className="mt-0.5 size-4 text-brand-red" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Delivery Address
                                                        </p>
                                                        <p className="font-semibold">
                                                            {order.deliveryAddress}
                                                        </p>
                                                    </div>
                                                </div>

                                                {order.message && (
                                                    <div className="rounded-lg bg-muted/50 p-3 sm:col-span-2">
                                                        <p className="text-xs text-muted-foreground">
                                                            Customer Message
                                                        </p>
                                                        <p className="mt-1 text-sm">
                                                            {order.message}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {order.status === "pending" && (
                                            <div className="flex flex-wrap gap-3 border-t pt-4">
                                                <Button
                                                    onClick={() =>
                                                        void handleStatus(order._id, "accepted")
                                                    }
                                                    disabled={actionId === order._id}
                                                >
                                                    <CheckCircle2 className="mr-2 size-4" />
                                                    Accept Order
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        void handleStatus(order._id, "rejected")
                                                    }
                                                    disabled={actionId === order._id}
                                                >
                                                    <XCircle className="mr-2 size-4" />
                                                    Reject Order
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                disabled={page <= 1 || isLoading}
                                onClick={() => setPage((value) => value - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={page >= totalPages || isLoading}
                                onClick={() => setPage((value) => value + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
