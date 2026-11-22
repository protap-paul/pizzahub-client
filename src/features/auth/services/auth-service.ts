
import { authClient } from "@/lib/auth/auth-client";
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

// Register a new customer or vendor
export async function signUpWithEmail(data: SignUpInput) {
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
    return authClient.signIn.email({
        email: data.email,
        password: data.password,
    });
}

// Sign in with Google
export async function signInWithGoogle() {
    return authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
    });
}

// Sign out the current user
export async function signOut() {
    return authClient.signOut();
}
