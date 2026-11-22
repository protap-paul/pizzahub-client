
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    OrderListResponse,
    UpdateOrderStatusInput,
} from "@/types/order-types";

export interface UpdateOrderStatusResponse {
    success: boolean;
    message: string;
}

// Get orders received by the logged-in vendor
export async function getVendorOrders(
    page = 1,
    limit = 10
): Promise<OrderListResponse> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    return apiRequest<OrderListResponse>(
        `${API_ENDPOINTS.ORDERS}/vendor?${params.toString()}`,
        { auth: true }
    );
}

// Accept or reject a pending order (Vendor only)
export async function updateVendorOrderStatus(
    orderId: string,
    data: UpdateOrderStatusInput
): Promise<UpdateOrderStatusResponse> {
    return apiRequest<UpdateOrderStatusResponse>(
        `${API_ENDPOINTS.ORDERS}/vendor/${orderId}/status`,
        {
            method: "PATCH",
            auth: true,
            body: JSON.stringify(data),
        }
    );
}
