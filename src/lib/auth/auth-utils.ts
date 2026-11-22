
import { authClient } from "./auth-client";

export async function getJWTToken(): Promise<string | null> {
    const { data, error } = await authClient.token();

    if (error) {
        throw error;
    }

    return data?.token ?? null;
}
