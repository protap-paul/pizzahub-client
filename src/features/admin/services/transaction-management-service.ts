
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    TransactionListResponse,
    TransactionStatus,
} from "@/types/transaction-types";

export interface AdminTransactionFilters {
    status?: TransactionStatus;
    page?: number;
    limit?: number;
}

// Get all transactions with status filter and pagination
export async function getAllTransactions(
    filters: AdminTransactionFilters = {}
): Promise<TransactionListResponse> {
    const query = new URLSearchParams();

    if (filters.status) query.set("status", filters.status);
    if (filters.page) query.set("page", String(filters.page));
    if (filters.limit) query.set("limit", String(filters.limit));

    const queryString = query.toString();
    const endpoint = `${API_ENDPOINTS.TRANSACTIONS}/admin/all`;

    return apiRequest<TransactionListResponse>(
        queryString ? `${endpoint}?${queryString}` : endpoint,
        { auth: true }
    );
}
