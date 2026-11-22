
import type { UserRole } from "@/types/auth-types";

export const APP_ROUTES = {
    HOME: "/",
    MENU: "/menu",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    AUTH_CALLBACK: "/auth/callback",
    PROFILE: "/profile",
    MENU_DETAILS: (id: string) => `/menu/${id}`,

    DASHBOARD: "/dashboard",

    VENDOR: {
        DASHBOARD: "/dashboard/vendor",
        ADD_MENU_ITEM: "/dashboard/vendor/menu-items/new",
        MY_MENU_ITEMS: "/dashboard/vendor/menu-items",
        ORDERS: "/dashboard/vendor/orders",
        SUBSCRIPTION: "/dashboard/vendor/subscription",
    },

    CUSTOMER: {
        DASHBOARD: "/dashboard/customer",
        MY_ORDERS: "/dashboard/customer/orders",
        FAVORITES: "/dashboard/customer/favorites",
    },

    ADMIN: {
        DASHBOARD: "/dashboard/admin",
        USERS: "/dashboard/admin/users",
        MENU_ITEMS: "/dashboard/admin/menu-items",
        TRANSACTIONS: "/dashboard/admin/transactions",
    },

    PAYMENT_SUCCESS: "/payment/success",
    PAYMENT_CANCEL: "/payment/cancel",
} as const;

export function getDashboardPath(role: UserRole | undefined | null): string {
    switch (role) {
        case "vendor":
            return APP_ROUTES.VENDOR.DASHBOARD;
        case "admin":
            return APP_ROUTES.ADMIN.DASHBOARD;
        default:
            return APP_ROUTES.CUSTOMER.DASHBOARD;
    }
}
