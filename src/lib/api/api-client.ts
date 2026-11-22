
import { getJWTToken } from "@/lib/auth/auth-utils";
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

        throw new Error(message);
    }

    return result as T;
}
