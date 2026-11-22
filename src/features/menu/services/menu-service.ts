
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    MenuFilters,
    MenuItem,
    MenuReview,
} from "@/types/menu-types";

interface MenuPagination {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
}

export interface MenuListResponse {
    success: boolean;
    message: string;
    data: MenuItem[];
    pagination: MenuPagination;
}

export interface MenuDetailsResponse {
    success: boolean;
    message: string;
    menuItem: MenuItem;
}

export interface MenuReviewsResponse {
    success: boolean;
    message: string;
    itemName: string;
    totalReviews: number;
    averageRating: number;
    reviews: MenuReview[];
}

export interface ImageUploadResponse {
    success: boolean;
    message: string;
    image: {
        url: string;
        displayUrl: string;
        deleteUrl: string;
    };
}

// Get public menu items
export async function getMenuItems(
    filters: MenuFilters = {}
): Promise<MenuListResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
            params.set(key, String(value));
        }
    });

    const query = params.toString();
    const endpoint = query
        ? `${API_ENDPOINTS.MENU_ITEMS}?${query}`
        : API_ENDPOINTS.MENU_ITEMS;

    return apiRequest<MenuListResponse>(endpoint);
}

// Get single menu item details (login required)
export async function getMenuItemById(
    id: string
): Promise<MenuDetailsResponse> {
    return apiRequest<MenuDetailsResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/${id}`,
        { auth: true }
    );
}

// Upload menu item image (Vendor only)
export async function uploadMenuItemImage(
    file: File
): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append("image", file);

    return apiRequest<ImageUploadResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/upload-image`,
        {
            method: "POST",
            auth: true,
            body: formData,
        }
    );
}
