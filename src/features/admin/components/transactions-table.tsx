"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { getAllUsers } from "@/features/admin/services/user-management-service";
import { getAllTransactions } from "@/features/admin/services/transaction-management-service";
import { formatDate, formatPrice } from "@/lib/formatters";
import type { Transaction, TransactionStatus } from "@/types/transaction-types";
import type { User } from "@/types/user-types";

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    limit: number;
}

const statusStyles: Record<TransactionStatus, string> = {
    completed: "bg-green-500/10 text-green-700 border-green-500/20",
    pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    failed: "bg-red-500/10 text-red-700 border-red-500/20",
    refunded: "bg-blue-500/10 text-blue-700 border-blue-500/20",
};

export function TransactionsTable() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [vendors, setVendors] = useState<Record<string, User>>({});
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await getAllTransactions({
                status: status === "all" ? undefined : (status as TransactionStatus),
                page,
                limit: 10,
            });

            setTransactions(response.transactions);
            setPagination(response.pagination);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to load transactions."
            );
        } finally {
            setIsLoading(false);
        }
    }, [page, status]);

    useEffect(() => {
        void Promise.resolve().then(fetchTransactions);
    }, [fetchTransactions]);

    useEffect(() => {
        async function loadVendors() {
            try {
                const response = await getAllUsers({ role: "vendor", limit: 50 });
                setVendors(
                    Object.fromEntries(response.users.map((user) => [user._id, user]))
                );
            } catch {
                // Vendor names are supplementary; the transaction list still works.
            }
        }

        void loadVendors();
    }, []);

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Admin Workspace"
                title="Transactions"
                description="View Stripe-verified premium subscription payments. Records are read-only."
            />

            <Card>
                <CardContent className="space-y-5 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="w-full sm:w-64">
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
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            {pagination?.totalTransactions ?? 0} transactions
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Session</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            Loading transactions...
                                        </TableCell>
                                    </TableRow>
                                ) : transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <CreditCard className="mx-auto mb-2 size-8" />
                                            No transactions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((transaction) => {
                                        const vendor = vendors[transaction.vendorId];

                                        return (
                                            <TableRow key={transaction._id}>
                                                <TableCell>
                                                    <p className="font-semibold">
                                                        {vendor?.name || "Unknown vendor"}
                                                    </p>
                                                    <p className="max-w-52 truncate text-xs text-muted-foreground">
                                                        {vendor?.email || transaction.vendorId}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {transaction.plan}
                                                </TableCell>
                                                <TableCell>
                                                    {formatPrice(transaction.amount)}{" "}
                                                    <span className="text-xs uppercase text-muted-foreground">
                                                        {transaction.currency}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            statusStyles[
                                                                transaction.status
                                                            ]
                                                        }
                                                    >
                                                        {transaction.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(transaction.createdAt)}
                                                </TableCell>
                                                <TableCell className="max-w-40 truncate font-mono text-xs text-muted-foreground">
                                                    {transaction.stripeSessionId}
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
