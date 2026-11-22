"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Search, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { getAllUsers } from "@/features/admin/services/user-management-service";
import { PageHeader } from "@/features/dashboard/components";
import {
    adminDeleteMenuItem,
    getAllMenuItems,
    updateMenuItemApproval,
    updateMenuItemAvailability,
} from "@/features/menu/services/admin-menu-service";
import { formatPrice } from "@/lib/formatters";
import type { MenuItem, MenuItemStatus } from "@/types/menu-types";
import type { User } from "@/types/user-types";

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

const statusStyles: Record<MenuItemStatus, string> = {
    pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    approved: "bg-green-500/10 text-green-700 border-green-500/20",
    rejected: "bg-red-500/10 text-red-700 border-red-500/20",
    inactive: "bg-gray-500/10 text-gray-700 border-gray-500/20",
};

async function fetchAllVendors(): Promise<User[]> {
    const firstPage = await getAllUsers({ role: "vendor", page: 1, limit: 50 });
    const allUsers = [...firstPage.users];

    for (let currentPage = 2; currentPage <= firstPage.pagination.totalPages; currentPage += 1) {
        const response = await getAllUsers({
            role: "vendor",
            page: currentPage,
            limit: 50,
        });

        allUsers.push(...response.users);
    }

    return allUsers;
}

export function MenuManagementTable() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [vendorNames, setVendorNames] = useState<Record<string, string>>({});
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [search]);

    const fetchItems = useCallback(async () => {
        try {
            setIsLoading(true);

            const [response, vendors] = await Promise.all([
                getAllMenuItems({
                    search: debouncedSearch || undefined,
                    status:
                        status === "all" ? undefined : (status as MenuItemStatus),
                    page,
                    limit: 10,
                }),
                fetchAllVendors(),
            ]);

            setItems(response.menuItems);
            setPagination(response.pagination);
            setVendorNames(
                Object.fromEntries(
                    vendors.map((vendor) => [
                        vendor._id,
                        vendor.businessName || vendor.name,
                    ])
                )
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load menu items."
            );
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, page, status]);

    useEffect(() => {
        void Promise.resolve().then(fetchItems);
    }, [fetchItems]);

    async function handleReview(id: string, nextStatus: "approved" | "rejected") {
        try {
            setActionId(id);
            const response = await updateMenuItemApproval(id, nextStatus);
            toast.success(response.message);
            await fetchItems();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to review item."
            );
        } finally {
            setActionId(null);
        }
    }

    async function handleAvailability(item: MenuItem) {
        try {
            setActionId(item._id);
            const response = await updateMenuItemAvailability(item._id, {
                isAvailable: !item.isAvailable,
            });
            toast.success(response.message);
            await fetchItems();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update availability."
            );
        } finally {
            setActionId(null);
        }
    }

    async function handleDelete(id: string) {
        try {
            setActionId(id);
            const response = await adminDeleteMenuItem(id);
            toast.success(response.message);
            await fetchItems();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete item."
            );
        } finally {
            setActionId(null);
        }
    }

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Admin Workspace"
                title="Manage Menu Items"
                description="Review new submissions, manage published listings, and remove inappropriate items."
            />

            <Card>
                <CardContent className="space-y-5 p-5 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search pizza name..."
                                className="pl-9"
                            />
                        </div>

                        <Select
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value ?? "all");
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {pagination?.totalItems ?? 0} items found
                    </p>

                    <div className="overflow-x-auto rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Availability</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            Loading menu items...
                                        </TableCell>
                                    </TableRow>
                                ) : items.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            No menu items match your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>
                                                <div className="flex min-w-48 items-center gap-3">
                                                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                                                        {item.images?.[0] ? (
                                                            <Image
                                                                src={item.images[0]}
                                                                alt={item.itemName}
                                                                fill
                                                                unoptimized
                                                                className="object-cover"
                                                            />
                                                        ) : null}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold">
                                                            {item.itemName}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {item.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="max-w-40 truncate">
                                                {vendorNames[item.vendorId] ||
                                                    item.vendor?.businessName ||
                                                    item.vendor?.name ||
                                                    "—"}
                                            </TableCell>

                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>
                                                {formatPrice(item.price)}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={statusStyles[item.status]}
                                                >
                                                    {item.status}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                {item.isAvailable ? "Available" : "Hidden"}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    {item.status === "pending" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() =>
                                                                    void handleReview(
                                                                        item._id,
                                                                        "approved"
                                                                    )
                                                                }
                                                                disabled={actionId === item._id}
                                                            >
                                                                <CheckCircle2 className="mr-1 size-3.5" />
                                                                Approve
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    void handleReview(
                                                                        item._id,
                                                                        "rejected"
                                                                    )
                                                                }
                                                                disabled={actionId === item._id}
                                                            >
                                                                <XCircle className="mr-1 size-3.5" />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}

                                                    {item.status === "approved" && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                void handleAvailability(item)
                                                            }
                                                            disabled={actionId === item._id}
                                                        >
                                                            {item.isAvailable
                                                                ? "Hide"
                                                                : "Show"}
                                                        </Button>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            void handleDelete(item._id)
                                                        }
                                                        disabled={actionId === item._id}
                                                        aria-label={`Delete ${item.itemName}`}
                                                    >
                                                        <Trash2 className="size-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                disabled={page <= 1 || isLoading}
                                onClick={() => setPage((value) => value - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={page >= pagination.totalPages || isLoading}
                                onClick={() => setPage((value) => value + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
