
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    CreateOrderInput,
    CreateOrderResponse,
    OrderListResponse,
} from "@/types/order-types";

export interface CancelOrderResponse {
    success: boolean;
    message: string;
}

// Create a new pizza order (Customer only)
export async function createOrder(
    data: CreateOrderInput
): Promise<CreateOrderResponse> {
    return apiRequest<CreateOrderResponse>(
        API_ENDPOINTS.ORDERS,
        {
            method: "POST",
            auth: true,
            body: JSON.stringify(data),
        }
    );
}

// Get orders placed by the logged-in customer
export async function getMyOrders(
    page = 1,
    limit = 10
): Promise<OrderListResponse> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    return apiRequest<OrderListResponse>(
        `${API_ENDPOINTS.ORDERS}/my-orders?${params.toString()}`,
        { auth: true }
    );
}

// Cancel a pending order (Customer only)
export async function cancelMyOrder(
    orderId: string
): Promise<CancelOrderResponse> {
    return apiRequest<CancelOrderResponse>(
        `${API_ENDPOINTS.ORDERS}/my-orders/${orderId}/cancel`,
        {
            method: "PATCH",
            auth: true,
        }
    );
}
