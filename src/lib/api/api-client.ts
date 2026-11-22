
import { getJWTToken } from "@/lib/auth/auth-utils";
import { authClient } from "@/lib/auth/auth-client";
import { ENV } from "@/config/env";

interface ApiRequestOptions extends RequestInit {
    auth?: boolean;
}

export async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T> {
    const baseURL = ENV.API_URL;

    if (!baseURL) {
        throw new Error("API URL is not configured.");
    }

    const {
        auth = false,
        headers: requestHeaders,
        ...requestOptions
    } = options;

    const headers = new Headers(requestHeaders);

    headers.set("Accept", "application/json");

    const isFormData =
        typeof FormData !== "undefined" &&
        requestOptions.body instanceof FormData;

    if (requestOptions.body && !isFormData) {
        headers.set("Content-Type", "application/json");
    }

    if (auth) {
        const token = await getJWTToken();

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    const response = await fetch(`${baseURL}${endpoint}`, {
        ...requestOptions,
        headers,
        credentials: "include",
    });

    if (response.status === 204) {
        return undefined as T;
    }

    let result: unknown;

    try {
        result = await response.json();
    } catch {
        result = null;
    }

    if (!response.ok) {
        const message =
            typeof result === "object" &&
                result !== null &&
                "message" in result &&
                typeof result.message === "string"
                ? result.message
                : `Request failed with status ${response.status}`;

        // The backend denies blocked users on every authenticated API call.
        // Sign them out so stale sessions cannot keep retrying protected routes.
        if (typeof window !== "undefined" && auth) {
            const redirectTo = `${window.location.pathname}${window.location.search}`;

            const buildSignInUrl = (error?: string) => {
                const url = new URL("/sign-in", window.location.origin);

                if (error) url.searchParams.set("error", error);
                url.searchParams.set("redirectTo", redirectTo);

                return url.toString();
            };

            if (message.toLowerCase().includes("blocked")) {
                void authClient.signOut().finally(() => {
                    window.location.assign(buildSignInUrl("blocked"));
                });
            } else if (
                response.status === 401 &&
                !window.location.pathname.startsWith("/sign-in")
            ) {
                void authClient.signOut().finally(() => {
                    window.location.assign(buildSignInUrl());
                });
            }
        }

        throw new Error(message);
    }

    return result as T;
}
