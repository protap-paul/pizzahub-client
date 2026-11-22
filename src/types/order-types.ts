
export type OrderStatus =
    | "pending"
    | "accepted"
    | "rejected"
    | "cancelled";

export interface OrderStatusHistory {
    status: OrderStatus;
    changedAt: string;
    changedBy: string;
    note: string;
}

export interface Order {
    _id: string;
    itemId: string;
    vendorId: string;
    customerId: string;
    deliveryDate: string;
    deliveryAddress: string;
    message: string;
    status: OrderStatus;
    statusHistory: OrderStatusHistory[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderInput {
    itemId: string;
    deliveryDate: string;
    deliveryAddress: string;
    message?: string;
}

export interface UpdateOrderStatusInput {
    status: "accepted" | "rejected";
}

export interface OrderPagination {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    limit: number;
}

export interface OrderListResponse {
    success: boolean;
    message: string;
    pagination: OrderPagination;
    orders: Order[];
}


export type CreatedOrder = Omit<Order, "_id">;

export interface CreateOrderResponse {
    success: boolean;
    message: string;
    orderId: string;
    order: CreatedOrder;
}

