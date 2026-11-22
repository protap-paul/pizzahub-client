import type { Metadata } from "next";

import { AuthGuard } from "@/features/auth/components";
import { PaymentResult } from "@/features/subscriptions/components";

export const metadata: Metadata = {
    title: "Payment Cancelled",
    description: "Your PizzaHub Premium checkout was cancelled.",
};

export default function PaymentCancelPage() {
    return (
        <AuthGuard requiredRole="vendor">
            <PaymentResult variant="cancel" />
        </AuthGuard>
    );
}
