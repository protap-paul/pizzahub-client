
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type { User } from "@/types/user-types";
import type { UserRole } from "@/types/auth-types";

export interface AdminUserFilters {
    role?: UserRole;
    search?: string;
    page?: number;
    limit?: number;
}

export interface AdminUserPagination {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
}

export interface AdminUserListResponse {
    success: boolean;
    message: string;
    pagination: AdminUserPagination;
    users: User[];
}

export interface UserActionResponse {
    success: boolean;
    message: string;
}

// Get all users with search, role filter and pagination
export async function getAllUsers(
    filters: AdminUserFilters = {}
): Promise<AdminUserListResponse> {
    const query = new URLSearchParams();

    if (filters.role) query.set("role", filters.role);
    if (filters.search) query.set("search", filters.search);
    if (filters.page) query.set("page", String(filters.page));
    if (filters.limit) query.set("limit", String(filters.limit));

    const queryString = query.toString();
    const endpoint = `${API_ENDPOINTS.USERS}/admin/all`;

    return apiRequest<AdminUserListResponse>(
        queryString ? `${endpoint}?${queryString}` : endpoint,
        { auth: true }
    );
}

// Block a customer or vendor
export async function blockUser(
    userId: string
): Promise<UserActionResponse> {
    return apiRequest<UserActionResponse>(
        `${API_ENDPOINTS.USERS}/admin/${userId}/block`,
        {
            method: "PATCH",
            auth: true,
        }
    );
}

// Unblock a customer or vendor
export async function unblockUser(
    userId: string
): Promise<UserActionResponse> {
    return apiRequest<UserActionResponse>(
        `${API_ENDPOINTS.USERS}/admin/${userId}/unblock`,
        {
            method: "PATCH",
            auth: true,
        }
    );
}
