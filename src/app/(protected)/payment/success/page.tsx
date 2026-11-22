import type { Metadata } from "next";

import { AuthGuard } from "@/features/auth/components";
import { PaymentResult } from "@/features/subscriptions/components";

export const metadata: Metadata = {
    title: "Payment Success",
    description: "Confirm your PizzaHub Premium subscription payment.",
};

export default function PaymentSuccessPage() {
    return (
        <AuthGuard requiredRole="vendor">
            <PaymentResult variant="success" />
        </AuthGuard>
    );
}
