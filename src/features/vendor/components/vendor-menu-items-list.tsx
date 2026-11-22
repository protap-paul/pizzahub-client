
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pizza, MapPin, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
    getMyMenuItems,
    updateMyMenuItemAvailability,
} from "@/features/menu/services/vendor-menu-service";

import type { MenuItem } from "@/types/menu-types";

interface MenuPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

export function VendorMenuItemsList() {
    const router = useRouter();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [pagination, setPagination] = useState<MenuPagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchMenuItems = useCallback(async (page = 1, refresh = false) => {
        try {
            if (refresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const response = await getMyMenuItems(page, 12);

            setMenuItems(response.menuItems);
            setPagination(response.pagination);
            setCurrentPage(response.pagination.currentPage);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load your menu items.",
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(() => fetchMenuItems(currentPage));
    }, [currentPage, fetchMenuItems]);

    const handleAvailabilityChange = async (item: MenuItem) => {
        try {
            setUpdatingId(item._id);

            await updateMyMenuItemAvailability(item._id, {
                isAvailable: !item.isAvailable,
            });

            toast.success("Menu item availability updated.");
            await fetchMenuItems(currentPage, true);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update availability.",
            );
        } finally {
            setUpdatingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="space-y-4 p-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-9 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <section className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-brand-red">
                        Vendor Workspace
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight">
                        My Menu Items
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage your pizza listings and availability.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Total items: {pagination?.totalItems ?? 0}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={() => void fetchMenuItems(currentPage, true)}
                        disabled={isRefreshing}
                    >
                        <RefreshCw
                            className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>

                    <Button
                        onClick={() =>
                            router.push("/dashboard/vendor/menu-items/new")
                        }
                    >
                        <Plus className="mr-2 size-4" />
                        Add Menu Item
                    </Button>
                </div>
            </div>

            {menuItems.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center py-16 text-center">
                        <Pizza className="mb-4 size-12 text-muted-foreground" />
                        <h2 className="text-xl font-semibold">No menu items yet</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Start by adding your first delicious pizza.
                        </p>
                        <Button
                            className="mt-5"
                            onClick={() =>
                                router.push("/dashboard/vendor/menu-items/new")
                            }
                        >
                            <Plus className="mr-2 size-4" />
                            Add Your First Item
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {menuItems.map((item) => (
                            <Card key={item._id} className="overflow-hidden">
                                <div className="relative h-48 bg-muted">
                                    {item.images?.[0] ? (
                                        <Image
                                            src={item.images[0]}
                                            alt={item.itemName}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Pizza className="size-12 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                <CardContent className="space-y-4 p-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                {item.itemName}
                                            </h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {item.category}
                                            </p>
                                        </div>

                                        <Badge
                                            variant={
                                                item.status === "approved"
                                                    ? "default"
                                                    : item.status === "rejected"
                                                        ? "destructive"
                                                        : "secondary"
                                            }
                                        >
                                            {item.status}
                                        </Badge>
                                    </div>

                                    <p className="text-xl font-bold text-brand-red">
                                        ৳{item.price}
                                    </p>

                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="size-4" />
                                        {item.location}
                                    </p>

                                    <div className="flex items-center justify-between border-t pt-4">
                                        <span className="text-sm text-muted-foreground">
                                            {item.isAvailable ? "Available" : "Unavailable"}
                                        </span>

                                        <Button
                                            size="sm"
                                            variant={item.isAvailable ? "outline" : "default"}
                                            disabled={
                                                item.status !== "approved" ||
                                                updatingId === item._id
                                            }
                                            onClick={() => void handleAvailabilityChange(item)}
                                        >
                                            {updatingId === item._id
                                                ? "Updating..."
                                                : item.isAvailable
                                                    ? "Make Unavailable"
                                                    : "Make Available"}
                                        </Button>
                                    </div>

                                    <Link
                                        href={`/dashboard/vendor/menu-items/${item._id}/edit`}
                                        className="inline-flex w-full items-center justify-center rounded-lg border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red transition hover:bg-brand-red hover:text-white"
                                    >
                                        Edit Item
                                    </Link>

                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((page) => page - 1)}
                            >
                                Previous
                            </Button>

                            <span className="text-sm text-muted-foreground">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>

                            <Button
                                variant="outline"
                                disabled={currentPage >= pagination.totalPages}
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
