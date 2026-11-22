
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type { MenuItem } from "@/types/menu-types";

export interface FavoritesResponse {
    success: boolean;
    message: string;
    totalFavorites: number;
    favorites: MenuItem[];
}

export interface FavoriteActionResponse {
    success: boolean;
    message: string;
}

// Get the logged-in customer's favorite items
export async function getMyFavorites(): Promise<FavoritesResponse> {
    return apiRequest<FavoritesResponse>(
        `${API_ENDPOINTS.USERS}/favorites`,
        { auth: true }
    );
}

// Add an item to favorites
export async function addFavorite(
    itemId: string
): Promise<FavoriteActionResponse> {
    return apiRequest<FavoriteActionResponse>(
        `${API_ENDPOINTS.USERS}/favorites/${itemId}`,
        {
            method: "POST",
            auth: true,
        }
    );
}

// Remove an item from favorites
export async function removeFavorite(
    itemId: string
): Promise<FavoriteActionResponse> {
    return apiRequest<FavoriteActionResponse>(
        `${API_ENDPOINTS.USERS}/favorites/${itemId}`,
        {
            method: "DELETE",
            auth: true,
        }
    );
}
