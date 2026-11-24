
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    AdminDashboardResponse,
    VendorDashboardResponse,
    CustomerDashboardResponse,
} from "@/types/dashboard-types";

// Get Admin dashboard statistics
export async function getAdminDashboardStats(cacheTtl?: number): Promise<AdminDashboardResponse> {
    return apiRequest<AdminDashboardResponse>(
        `${API_ENDPOINTS.DASHBOARD}/admin`,
        { auth: true, cacheTtl }
    );
}

// Get Vendor dashboard statistics
export async function getVendorDashboardStats(cacheTtl?: number): Promise<VendorDashboardResponse> {
    return apiRequest<VendorDashboardResponse>(
        `${API_ENDPOINTS.DASHBOARD}/vendor`,
        { auth: true, cacheTtl }
    );
}

// Get Customer dashboard statistics
export async function getCustomerDashboardStats(cacheTtl?: number): Promise<CustomerDashboardResponse> {
    return apiRequest<CustomerDashboardResponse>(
        `${API_ENDPOINTS.DASHBOARD}/customer`,
        { auth: true, cacheTtl }
    );
}
