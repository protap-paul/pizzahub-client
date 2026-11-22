
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";

export interface CheckoutSessionResponse {
    success: boolean;
    message: string;
    url: string;
}

export interface CancelSubscriptionResponse {
    success: boolean;
    message: string;
    subscription: {
        id: string;
        cancelAtPeriodEnd: boolean;
        currentPeriodEnd: string;
    };
}

// Create Stripe Premium Checkout Session
export async function createCheckoutSession(): Promise<CheckoutSessionResponse> {
    return apiRequest<CheckoutSessionResponse>(
        `${API_ENDPOINTS.SUBSCRIPTIONS}/create-checkout-session`,
        {
            method: "POST",
            auth: true,
        }
    );
}

// Schedule Premium Subscription Cancellation
export async function cancelPremiumSubscription(): Promise<CancelSubscriptionResponse> {
    return apiRequest<CancelSubscriptionResponse>(
        `${API_ENDPOINTS.SUBSCRIPTIONS}/cancel`,
        {
            method: "PATCH",
            auth: true,
        }
    );
}
