
import type { SubscriptionPlan, UserRole } from "./auth-types";

export interface User {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role: UserRole;
    isBlocked?: boolean;
    businessName?: string;
    subscriptionPlan: SubscriptionPlan;
    subscriptionExpiresAt: string | null;
    createdAt?: string;
}

export interface UpdateProfileInput {
    name?: string;
    image?: string;
    businessName?: string;
}
