
export type TransactionStatus =
    | "completed"
    | "pending"
    | "failed"
    | "refunded";

export type TransactionPlan = "premium";

export interface Transaction {
    _id: string;
    vendorId: string;
    plan: TransactionPlan;
    amount: number;
    currency: string;
    stripeSessionId: string;
    stripeSubscriptionId: string;
    status: TransactionStatus;
    createdAt: string;
}

export interface TransactionPagination {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    limit: number;
}

export interface TransactionListResponse {
    success: boolean;
    message: string;
    pagination: TransactionPagination;
    transactions: Transaction[];
}
