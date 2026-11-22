
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
    CalendarDays,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    Ban,
    Package,
    RefreshCw,
    Store,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/features/dashboard/components";

import {
    cancelMyOrder,
    getMyOrders,
} from "@/features/orders/services/customer-order-service";
import { getMenuItems } from "@/features/menu/services/menu-service";

import type { MenuItem } from "@/types/menu-types";
import type {
    Order,
    OrderStatus,
} from "@/types/order-types";

const statusConfig: Record<
    OrderStatus,
    { label: string; icon: typeof Clock; className: string }
> = {
    pending: {
        label: "Pending",
        icon: Clock,
        className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    },
    accepted: {
        label: "Accepted",
        icon: CheckCircle2,
        className: "bg-green-500/10 text-green-700 border-green-500/20",
    },
    rejected: {
        label: "Rejected",
        icon: XCircle,
        className: "bg-red-500/10 text-red-700 border-red-500/20",
    },
    cancelled: {
        label: "Cancelled",
        icon: Ban,
        className: "bg-gray-500/10 text-gray-700 border-gray-500/20",
    },
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
    }).format(new Date(date));
}

function OrderTimeline({ order }: { order: Order }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Order Status Timeline</h3>

            {order.statusHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No status history available.
                </p>
            ) : (
                <div className="space-y-4">
                    {order.statusHistory.map((history, index) => {
                        const config = statusConfig[history.status];
                        const Icon = config.icon;

                        return (
                            <div key={`${history.changedAt}-${index}`} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="rounded-full bg-muted p-2">
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    {index !== order.statusHistory.length - 1 && (
                                        <div className="mt-2 h-6 w-px bg-border" />
                                    )}
                                </div>

                                <div className="min-w-0 pb-2">
                                    <p className="text-sm font-semibold">
                                        {config.label}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {history.note}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDate(history.changedAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function MyOrdersList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [items, setItems] = useState<Record<string, MenuItem>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);

            const [orderResponse, menuResponse] = await Promise.all([
                getMyOrders(currentPage, 10),
                getMenuItems({ limit: 100 }),
            ]);

            setOrders(orderResponse.orders);
            setTotalPages(orderResponse.pagination.totalPages);
            setItems(
                Object.fromEntries(
                    menuResponse.data.map((item) => [item._id, item])
                )
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load your orders.",
            );
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        void Promise.resolve().then(fetchOrders);
    }, [fetchOrders]);

    async function handleCancel(orderId: string) {
        try {
            setCancellingId(orderId);

            const response = await cancelMyOrder(orderId);

            toast.success(response.message || "Order cancelled successfully.");

            await fetchOrders();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to cancel order.",
            );
        } finally {
            setCancellingId(null);
        }
    }

    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Customer Dashboard"
                title="My Orders"
                description="Track and manage your pizza orders."
                action={
                    <Button
                        variant="outline"
                        onClick={fetchOrders}
                        disabled={isLoading}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
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
                    <CardContent className="flex flex-col items-center py-14 text-center">
                        <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h2 className="text-xl font-bold">No orders yet</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Your pizza orders will appear here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="space-y-5">
                        {orders.map((order) => {
                            const config = statusConfig[order.status];
                            const StatusIcon = config.icon;
                            const isExpanded = expandedOrderId === order._id;
                            const item = items[order.itemId];

                            return (
                                <Card key={order._id} className="overflow-hidden">
                                    <CardContent className="space-y-5 p-5 sm:p-6">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Order #{order._id.slice(-8)}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Requested {formatDate(order.createdAt)}
                                                </p>
                                            </div>

                                            <Badge
                                                variant="outline"
                                                className={config.className}
                                            >
                                                <StatusIcon className="mr-1 h-3.5 w-3.5" />
                                                {config.label}
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
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <Package className="size-8 text-muted-foreground" />
                                                    </div>
                                                )}
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
                                                        Vendor
                                                    </p>
                                                    <p className="flex items-center gap-1 font-semibold">
                                                        <Store className="size-4 text-brand-red" />
                                                        {item?.vendor?.businessName ||
                                                            item?.vendor?.name ||
                                                            "Pizza Vendor"}
                                                    </p>
                                                </div>

                                                <div className="flex gap-3">
                                                    <CalendarDays className="mt-0.5 h-4 w-4 text-brand-red" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Delivery Date
                                                        </p>
                                                        <p className="text-sm font-semibold">
                                                            {formatDate(order.deliveryDate)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    <p>Order Reference</p>
                                                    <p className="font-mono">
                                                        #{order.itemId.slice(-8)}
                                                    </p>
                                                </div>

                                                <div className="flex gap-3 sm:col-span-2">
                                                    <MapPin className="mt-0.5 h-4 w-4 text-brand-red" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Delivery Address
                                                        </p>
                                                        <p className="text-sm font-semibold">
                                                            {order.deliveryAddress}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {order.message && (
                                            <div className="rounded-lg bg-muted/50 p-3">
                                                <p className="text-xs text-muted-foreground">
                                                    Additional Message
                                                </p>
                                                <p className="mt-1 text-sm">{order.message}</p>
                                            </div>
                                        )}

                                        <Separator />

                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setExpandedOrderId(
                                                        isExpanded ? null : order._id,
                                                    )
                                                }
                                            >
                                                {isExpanded ? "Hide Timeline" : "View Timeline"}
                                            </Button>

                                            {order.status === "pending" && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={cancellingId === order._id}
                                                    onClick={() => handleCancel(order._id)}
                                                >
                                                    {cancellingId === order._id
                                                        ? "Cancelling..."
                                                        : "Cancel Order"}
                                                </Button>
                                            )}
                                        </div>

                                        {isExpanded && (
                                            <>
                                                <Separator />
                                                <OrderTimeline order={order} />
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Button
                                variant="outline"
                                disabled={currentPage <= 1 || isLoading}
                                onClick={() => setCurrentPage((page) => page - 1)}
                            >
                                Previous
                            </Button>

                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                disabled={currentPage >= totalPages || isLoading}
                                onClick={() => setCurrentPage((page) => page + 1)}
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
