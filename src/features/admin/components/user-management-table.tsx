"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Search, UsersRound } from "lucide-react";
import { toast } from "sonner";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
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

import { PageHeader } from "@/features/dashboard/components";
import { useAuth } from "@/features/auth/hooks";
import {
    blockUser,
    getAllUsers,
    unblockUser,
} from "@/features/admin/services/user-management-service";
import { formatDate } from "@/lib/formatters";
import type { User } from "@/types/user-types";

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
}

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function UserManagementTable() {
    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [role, setRole] = useState("all");
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

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await getAllUsers({
                search: debouncedSearch || undefined,
                role: role === "all" ? undefined : (role as User["role"]),
                page,
                limit: 10,
            });

            setUsers(response.users);
            setPagination(response.pagination);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load users."
            );
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, page, role]);

    useEffect(() => {
        void Promise.resolve().then(fetchUsers);
    }, [fetchUsers]);

    async function handleToggleBlock(user: User) {
        try {
            setActionId(user._id);

            const response = user.isBlocked
                ? await unblockUser(user._id)
                : await blockUser(user._id);

            toast.success(response.message);
            await fetchUsers();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to update user."
            );
        } finally {
            setActionId(null);
        }
    }

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Admin Workspace"
                title="Manage Users"
                description="Search registered customers and vendors, review their details, and control platform access."
            />

            <Card>
                <CardContent className="space-y-5 p-5 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_220px_auto]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by name or email..."
                                className="pl-9"
                            />
                        </div>

                        <Select
                            value={role}
                            onValueChange={(value) => {
                                setRole(value ?? "all");
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="vendor">Vendor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() => void fetchUsers()}
                            disabled={isLoading}
                        >
                            <RefreshCw className="mr-2 size-4" />
                            Refresh
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {pagination?.totalUsers ?? 0} users found
                    </p>

                    <div className="overflow-x-auto rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            Loading users...
                                        </TableCell>
                                    </TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <UsersRound className="mx-auto mb-2 size-8" />
                                            No users match your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => {
                                        const isSelf = currentUser?.id === user._id;

                                        return (
                                            <TableRow key={user._id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar size="sm">
                                                            {user.image ? (
                                                                <AvatarImage
                                                                    src={user.image}
                                                                    alt={user.name}
                                                                />
                                                            ) : null}
                                                            <AvatarFallback>
                                                                {initials(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold">
                                                                {user.name}
                                                            </p>
                                                            <p className="truncate text-xs text-muted-foreground">
                                                                {user.email}
                                                            </p>
                                                            {user.businessName && (
                                                                <p className="truncate text-xs text-muted-foreground">
                                                                    {user.businessName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="capitalize">
                                                    {user.role}
                                                </TableCell>

                                                <TableCell className="capitalize">
                                                    {user.subscriptionPlan ?? "free"}
                                                </TableCell>

                                                <TableCell>
                                                    {user.createdAt
                                                        ? formatDate(user.createdAt)
                                                        : "—"}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            user.isBlocked
                                                                ? "destructive"
                                                                : "default"
                                                        }
                                                    >
                                                        {user.isBlocked
                                                            ? "Blocked"
                                                            : "Active"}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant={
                                                            user.isBlocked
                                                                ? "outline"
                                                                : "destructive"
                                                        }
                                                        disabled={
                                                            actionId === user._id ||
                                                            isSelf ||
                                                            user.role === "admin"
                                                        }
                                                        onClick={() =>
                                                            void handleToggleBlock(user)
                                                        }
                                                    >
                                                        {actionId === user._id
                                                            ? "Updating..."
                                                            : user.isBlocked
                                                                ? "Unblock"
                                                                : "Block"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
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
