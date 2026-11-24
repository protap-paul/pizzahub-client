
import { authClient } from "./auth-client";

const EXPIRY_MARGIN_MS = 60_000;
const FALLBACK_TTL_MS = 5 * 60_000;

interface CachedToken {
    token: string;
    expiresAt: number;
}

let cachedToken: CachedToken | null = null;
let pendingToken: Promise<string | null> | null = null;
let cacheGeneration = 0;

function getTokenExpiry(token: string): number | null {
    try {
        const payload = token.split(".")[1];

        if (!payload) return null;

        const decoded = JSON.parse(
            atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        ) as { exp?: number };

        return typeof decoded.exp === "number"
            ? decoded.exp * 1000
            : null;
    } catch {
        return null;
    }
}

async function fetchToken(): Promise<string | null> {
    const { data, error } = await authClient.token();

    if (error) {
        throw error;
    }

    return data?.token ?? null;
}

export async function getJWTToken(): Promise<string | null> {
    // Never share an in-memory token across requests on the server.
    if (typeof window === "undefined") {
        return fetchToken();
    }

    if (
        cachedToken &&
        cachedToken.expiresAt > Date.now() + EXPIRY_MARGIN_MS
    ) {
        return cachedToken.token;
    }

    if (pendingToken) {
        return pendingToken;
    }

    const generation = cacheGeneration;

    pendingToken = fetchToken()
        .then((token) => {
            if (token && generation === cacheGeneration) {
                cachedToken = {
                    token,
                    expiresAt:
                        getTokenExpiry(token) ?? Date.now() + FALLBACK_TTL_MS,
                };
            }

            return token;
        })
        .finally(() => {
            pendingToken = null;
        });

    return pendingToken;
}

export function clearJWTTokenCache() {
    cacheGeneration += 1;
    cachedToken = null;
    pendingToken = null;
}
