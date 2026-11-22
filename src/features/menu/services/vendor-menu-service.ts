
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    CreateMenuItemInput,
    MenuAvailabilityInput,
    MenuItem,
    UpdateMenuItemInput,
} from "@/types/menu-types";

interface VendorMenuPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

export interface VendorMenuListResponse {
    success: boolean;
    message: string;
    pagination: VendorMenuPagination;
    menuItems: MenuItem[];
}

export interface CreateMenuItemResponse {
    success: boolean;
    message: string;
    menuItem: MenuItem;
}

export interface UpdateMenuItemResponse {
    success: boolean;
    message: string;
    updatedFields: UpdateMenuItemInput;
}

export interface VendorMenuAvailabilityResponse {
    success: boolean;
    message: string;
    isAvailable: boolean;
}

export interface DeleteMenuItemResponse {
    success: boolean;
    message: string;
}

export interface VendorMenuDetailsResponse {
    success: boolean;
    message: string;
    menuItem: MenuItem;
}

// Get the logged-in vendor's menu items
export async function getMyMenuItems(
    page = 1,
    limit = 12
): Promise<VendorMenuListResponse> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    return apiRequest<VendorMenuListResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/my-items?${params.toString()}`,
        { auth: true }
    );
}

// Create a new menu item
export async function createMenuItem(
    data: CreateMenuItemInput
): Promise<CreateMenuItemResponse> {
    return apiRequest<CreateMenuItemResponse>(
        API_ENDPOINTS.MENU_ITEMS,
        {
            method: "POST",
            auth: true,
            body: JSON.stringify(data),
        }
    );
}

// Update an existing menu item
export async function updateMyMenuItem(
    id: string,
    data: UpdateMenuItemInput
): Promise<UpdateMenuItemResponse> {
    return apiRequest<UpdateMenuItemResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/${id}`,
        {
            method: "PATCH",
            auth: true,
            body: JSON.stringify(data),
        }
    );
}

// Change menu item availability
export async function updateMyMenuItemAvailability(
    id: string,
    data: MenuAvailabilityInput
): Promise<VendorMenuAvailabilityResponse> {
    return apiRequest<VendorMenuAvailabilityResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/my-items/${id}/availability`,
        {
            method: "PATCH",
            auth: true,
            body: JSON.stringify(data),
        }
    );
}

// Delete a menu item
export async function deleteMyMenuItem(
    id: string
): Promise<DeleteMenuItemResponse> {
    return apiRequest<DeleteMenuItemResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/${id}`,
        {
            method: "DELETE",
            auth: true,
        }
    );
}

// Get a single menu item owned by the logged-in vendor
export async function getMyMenuItemById(
    id: string
): Promise<VendorMenuDetailsResponse> {
    return apiRequest<VendorMenuDetailsResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/my-items/${id}`,
        { auth: true }
    );
}