
import { authClient } from "@/lib/auth/auth-client";
import { clearApiCache } from "@/lib/api/api-client";
import { clearJWTTokenCache } from "@/lib/auth/auth-utils";
import type { SignupRole } from "@/types/auth-types";

export interface SignUpInput {
    name: string;
    email: string;
    password: string;
    role: SignupRole;
    businessName?: string;
    image?: string;
}

export interface SignInInput {
    email: string;
    password: string;
}

function clearSessionCaches() {
    clearJWTTokenCache();
    clearApiCache();
}

// Register a new customer or vendor
export async function signUpWithEmail(data: SignUpInput) {
    clearSessionCaches();

    return authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        ...(data.businessName
            ? { businessName: data.businessName }
            : {}),
        ...(data.image ? { image: data.image } : {}),
    });
}

// Sign in with email and password
export async function signInWithEmail(data: SignInInput) {
    clearSessionCaches();

    return authClient.signIn.email({
        email: data.email,
        password: data.password,
    });
}

// Sign in with Google
export async function signInWithGoogle(callbackURL = "/") {
    clearSessionCaches();

    return authClient.signIn.social({
        provider: "google",
        callbackURL,
    });
}

// Sign out the current user
export async function signOut() {
    clearSessionCaches();

    return authClient.signOut();
}
