
import { getJWTToken, clearJWTTokenCache } from "@/lib/auth/auth-utils";
import { authClient } from "@/lib/auth/auth-client";
import { ENV } from "@/config/env";

interface ApiRequestOptions extends RequestInit {
    auth?: boolean;
    /** Set to 0 to skip the short-lived cache (used by refresh buttons). */
    cacheTtl?: number;
}

const DEFAULT_CACHE_TTL_MS = 15_000;

interface CacheEntry {
    value: unknown;
    expiresAt: number;
}

// Browser-only: never let one server-side request reuse another user's data.
const responseCache = new Map<string, CacheEntry>();
const pendingResponses = new Map<string, Promise<unknown>>();

export function clearApiCache() {
    responseCache.clear();
    pendingResponses.clear();
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
        cacheTtl = DEFAULT_CACHE_TTL_MS,
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

    let token: string | null = null;

    if (auth) {
        token = await getJWTToken();

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    const method = (requestOptions.method ?? "GET").toUpperCase();
    const isRead = method === "GET" || method === "HEAD";
    const canCache = isRead && cacheTtl > 0 && typeof window !== "undefined";
    const cacheKey = canCache
        ? `${auth ? token ?? "anonymous" : "public"}|${method}|${endpoint}${requestOptions.body ? String(requestOptions.body) : ""}`
        : null;

    if (cacheKey) {
        const cached = responseCache.get(cacheKey);

        if (cached && cached.expiresAt > Date.now()) {
            return cached.value as T;
        }

        const pending = pendingResponses.get(cacheKey);

        if (pending) {
            return pending as Promise<T>;
        }
    }

    const send = async (): Promise<T> => {
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
                clearApiCache();
                clearJWTTokenCache();

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

        // A successful write can invalidate anything read before it.
        if (!isRead && typeof window !== "undefined") {
            clearApiCache();
        }

        return result as T;
    };

    if (!cacheKey) {
        return send();
    }

    const request = send()
        .then((value) => {
            responseCache.set(cacheKey, {
                value,
                expiresAt: Date.now() + cacheTtl,
            });

            return value;
        })
        .finally(() => {
            pendingResponses.delete(cacheKey);
        });

    pendingResponses.set(cacheKey, request);

    return request;
}
