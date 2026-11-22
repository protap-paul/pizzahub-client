
import { createAuthClient } from "better-auth/react";
import {
    inferAdditionalFields,
    jwtClient,
} from "better-auth/client/plugins";

// In the browser, talk to the API through this app's own origin so the
// session cookie is first-party. On the server, fall back to the API URL.
const authBaseURL =
    typeof window !== "undefined"
        ? `${window.location.origin}/api/auth`
        : process.env.NEXT_PUBLIC_API_URL;

export const authClient = createAuthClient({
    baseURL: authBaseURL,

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
