
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    Order,
    OrderStatus,
} from "@/types/order-types";

interface AdminOrderPagination {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    limit: number;
}

export interface AdminOrderFilters {
    status?: OrderStatus;
    page?: number;
    limit?: number;
}

export interface AdminOrderListResponse {
    success: boolean;
    message: string;
    pagination: AdminOrderPagination;
    orders: Order[];
}

export interface AdminDeleteOrderResponse {
    success: boolean;
    message: string;
}

// Get all customer orders (Admin only)
export async function getAllOrders(
    filters: AdminOrderFilters = {}
): Promise<AdminOrderListResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
            params.set(key, String(value));
        }
    });

    const query = params.toString();
    const endpoint = query
        ? `${API_ENDPOINTS.ORDERS}/admin/all?${query}`
        : `${API_ENDPOINTS.ORDERS}/admin/all`;

    return apiRequest<AdminOrderListResponse>(endpoint, {
        auth: true,
    });
}

// Delete any order (Admin only)
export async function adminDeleteOrder(
    orderId: string
): Promise<AdminDeleteOrderResponse> {
    return apiRequest<AdminDeleteOrderResponse>(
        `${API_ENDPOINTS.ORDERS}/admin/${orderId}`,
        {
            method: "DELETE",
            auth: true,
        }
    );
}
