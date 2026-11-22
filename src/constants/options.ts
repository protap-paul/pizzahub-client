
import type {
    MenuCategory,
    MenuItemStatus,
} from "@/types/menu-types";
import type { OrderStatus } from "@/types/order-types";
import type { UserRole } from "@/types/auth-types";

export const MENU_CATEGORIES: MenuCategory[] = [
    "Classic",
    "Vegetarian",
    "Meat Lovers",
    "Specialty/Gourmet",
    "Sides/Appetizers",
    "Beverages/Desserts",
];

export const MENU_STATUS_OPTIONS: MenuItemStatus[] = [
    "pending",
    "approved",
    "rejected",
    "inactive",
];

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
    "pending",
    "accepted",
    "rejected",
    "cancelled",
];

export const USER_ROLES: UserRole[] = [
    "customer",
    "vendor",
    "admin",
];

export const MENU_SORT_OPTIONS = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
] as const;
