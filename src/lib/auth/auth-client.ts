
import { createAuthClient } from "better-auth/react";
import {
    inferAdditionalFields,
    jwtClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,

    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: ["customer", "vendor", "admin"],
                    required: false,
                    defaultValue: "customer",
                    input: true,
                },
                isBlocked: {
                    type: "boolean",
                    required: false,
                    defaultValue: false,
                    input: false,
                },
                businessName: {
                    type: "string",
                    required: false,
                    input: true,
                },
                subscriptionPlan: {
                    type: ["free", "premium"],
                    required: false,
                    defaultValue: "free",
                    input: false,
                },
                subscriptionExpiresAt: {
                    type: "date",
                    required: false,
                    input: false,
                },
            },
        }),

        jwtClient(),
    ],

    fetchOptions: {
        credentials: "include",
    },
});
