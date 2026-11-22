
import type { SubscriptionPlan } from "./auth-types";

export type MenuItemStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "inactive";

export type MenuCategory =
    | "Classic"
    | "Vegetarian"
    | "Meat Lovers"
    | "Specialty/Gourmet"
    | "Sides/Appetizers"
    | "Beverages/Desserts";

export interface MenuVendor {
    name: string;
    image?: string;
    businessName?: string;
    subscriptionPlan: SubscriptionPlan;
    isPremium?: boolean;
}

export interface MenuReview {
    customerId: string;
    customerName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface MenuItem {
    _id: string;
    vendorId: string;
    itemName: string;
    category: MenuCategory;
    description: string;
    price: number;
    location: string;
    images: string[];
    status: MenuItemStatus;
    isAvailable: boolean;
    reviews?: MenuReview[];
    totalReviews?: number;
    averageRating?: number;
    isFeatured?: boolean;
    vendor?: MenuVendor | null;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateMenuItemInput {
    itemName: string;
    category: MenuCategory;
    description: string;
    price: number;
    location: string;
    images: string[];
}

export type UpdateMenuItemInput =
    Partial<CreateMenuItemInput>;

export interface MenuFilters {
    search?: string;
    category?: MenuCategory;
    location?: string;
    sort?: "newest" | "price_asc" | "price_desc";
    page?: number;
    limit?: number;
}

export interface MenuAvailabilityInput {
    isAvailable: boolean;
}

export interface CreateMenuReviewInput {
    rating: number;
    comment: string;
}

export interface MenuReviewResponse {
    itemName: string;
    totalReviews: number;
    averageRating: number;
    reviews: MenuReview[];
}
