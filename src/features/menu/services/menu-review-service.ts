
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    CreateMenuReviewInput,
} from "@/types/menu-types";
import type {
    MenuReviewsResponse,
} from "./menu-service";

export interface CreateMenuReviewResponse {
    success: boolean;
    message: string;
    totalReviews: number;
    averageRating: number;
}

// Get reviews for a menu item
export async function getMenuItemReviews(
    itemId: string
): Promise<MenuReviewsResponse> {
    return apiRequest<MenuReviewsResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/${itemId}/reviews`
    );
}

// Add a review (Customer only)
export async function addMenuItemReview(
    itemId: string,
    data: CreateMenuReviewInput
): Promise<CreateMenuReviewResponse> {
    return apiRequest<CreateMenuReviewResponse>(
        `${API_ENDPOINTS.MENU_ITEMS}/${itemId}/reviews`,
        {
            method: "POST",
            auth: true,
            body: JSON.stringify(data),
        }
    );
}
