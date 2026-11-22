
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    AdminDashboardResponse,
    VendorDashboardResponse,
    CustomerDashboardResponse,
} from "@/types/dashboard-types";

// Get Admin dashboard statistics
export async function getAdminDashboardStats(): Promise<AdminDashboardResponse> {
    return apiRequest<AdminDashboardResponse>(
        `${API_ENDPOINTS.DASHBOARD}/admin`,
        { auth: true }
    );
}

// Get Vendor dashboard statistics
export async function getVendorDashboardStats(): Promise<VendorDashboardResponse> {
    return apiRequest<VendorDashboardResponse>(
        `${API_ENDPOINTS.DASHBOARD}/vendor`,
        { auth: true }
    );
}

// Get Customer dashboard statistics
export async function getCustomerDashboardStats(): Promise<CustomerDashboardResponse> {
    return apiRequest<CustomerDashboardResponse>(
        `${API_ENDPOINTS.DASHBOARD}/customer`,
        { auth: true }
    );
}
