
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    MenuItem,
    MenuItemStatus,
    MenuAvailabilityInput,
} from "@/types/menu-types";

interface AdminMenuPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

export interface AdminMenuFilters {
    status?: MenuItemStatus;
    search?: string;
    page?: number;
    limit?: number;
}

export interface AdminMenuListResponse {
    success: boolean;
    message: string;
    pagination: AdminMenuPagination;
    menuItems: MenuItem[];
}

export interface MenuApprovalResponse {
    success: boolean;
    message: string;
    updatedStatus: "approved" | "rejected";
}

export interface AdminMenuAvailabilityResponse {
    success: boolean;
    message: string;
    isAvailable: boolean;
}

export interface AdminDeleteMenuItemResponse {
    success: boolean;
    message: string;
}

// Get all menu items for Admin
export async function getAllMenuItems(
    filters: AdminMenuFilters = {}
): Promise<AdminMenuListResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
            params.set(key, String(value));
        }
    });

    const query = params.toString();
    const endpoint = query
        ? `${API_ENDPOINTS.MENU_ITEMS}/admin/all?${query}`
        : `${API_ENDPOINTS.MENU_ITEMS}/admin/all`;

    return apiRequest<AdminMenuListResponse>(endpoint, {
        auth: true,
    });
}

// Approve or reject a menu item
export async function updateMenuItemApproval(
    id: string,
    status: "approved" | "rejected"
): Promise<MenuApprovalResponse> {
    return apiRequest<MenuApprovalResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/admin/${id}/approval`,
        {
            method: "PATCH",
            auth: true,
            body: JSON.stringify({ status }),
        }
    );
}

// Change menu item availability
export async function updateMenuItemAvailability(
    id: string,
    data: MenuAvailabilityInput
): Promise<AdminMenuAvailabilityResponse> {
    return apiRequest<AdminMenuAvailabilityResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/admin/${id}/availability`,
        {
            method: "PATCH",
            auth: true,
            body: JSON.stringify(data),
        }
    );
}

// Delete any menu item (Admin only)
export async function adminDeleteMenuItem(
    id: string
): Promise<AdminDeleteMenuItemResponse> {
    return apiRequest<AdminDeleteMenuItemResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/admin/${id}`,
        {
            method: "DELETE",
            auth: true,
        }
    );
}
