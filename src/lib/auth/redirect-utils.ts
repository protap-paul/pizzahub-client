import { getDashboardPath } from "@/constants/routes";
import type { UserRole } from "@/types/auth-types";

/**
 * Only allow same-origin paths for post-authentication redirects.
 * This prevents an attacker from supplying `?redirectTo=https://evil.com`.
 */
export function getSafeRedirect(
    value: string | null | undefined,
    fallback: string
): string {
    if (!value) return fallback;

    const decoded = (() => {
        try {
            return decodeURIComponent(value);
        } catch {
            return value;
        }
    })();

    if (
        decoded.startsWith("/") &&
        !decoded.startsWith("//") &&
        !decoded.startsWith("/\\")
    ) {
        return decoded;
    }

    return fallback;
}

export function getRoleBasedRedirect(
    role: UserRole | undefined | null,
    requested?: string | null
): string {
    return getSafeRedirect(requested, getDashboardPath(role));
}
