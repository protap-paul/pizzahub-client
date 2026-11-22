
export const APP_ROUTES = {
    HOME: "/",
    MENU: "/menu",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    PROFILE: "/profile",
    MENU_DETAILS: (id: string) => `/menu/${id}`,

    DASHBOARD: "/dashboard",

    VENDOR: {
        DASHBOARD: "/dashboard/vendor",
        ADD_MENU_ITEM: "/dashboard/vendor/add-menu-item",
        MY_MENU_ITEMS: "/dashboard/vendor/my-menu-items",
        ORDERS: "/dashboard/vendor/orders",
        SUBSCRIPTION: "/dashboard/vendor/subscription",
    },

    CUSTOMER: {
        DASHBOARD: "/dashboard/customer",
        MY_ORDERS: "/dashboard/customer/my-orders",
        FAVORITES: "/dashboard/customer/favorites",
    },

    ADMIN: {
        DASHBOARD: "/dashboard/admin",
        USERS: "/dashboard/admin/users",
        MENU_ITEMS: "/dashboard/admin/menu-items",
        TRANSACTIONS: "/dashboard/admin/transactions",
    },

    PAYMENT_SUCCESS: "/dashboard/vendor/subscription",
    PAYMENT_CANCEL: "/dashboard/vendor/subscription",
} as const;
