
export interface AdminDashboardStats {
    totalUsers: number;
    totalCustomers: number;
    totalVendors: number;
    totalMenuItems: number;
    pendingMenuItems: number;
    totalOrders: number;
    pendingOrders: number;
    totalTransactions: number;
}

export interface VendorDashboardStats {
    totalMenuItems: number;
    approvedMenuItems: number;
    pendingMenuItems: number;
    rejectedMenuItems: number;
    availableMenuItems: number;
    totalOrders: number;
    pendingOrders: number;
    acceptedOrders: number;
    rejectedOrders: number;
}

export interface CustomerDashboardStats {
    totalOrders: number;
    pendingOrders: number;
    acceptedOrders: number;
    rejectedOrders: number;
    cancelledOrders: number;
}

export interface DashboardResponse<T> {
    success: boolean;
    message: string;
    stats: T;
}

export type AdminDashboardResponse =
    DashboardResponse<AdminDashboardStats>;

export type VendorDashboardResponse =
    DashboardResponse<VendorDashboardStats>;

export type CustomerDashboardResponse =
    DashboardResponse<CustomerDashboardStats>;
