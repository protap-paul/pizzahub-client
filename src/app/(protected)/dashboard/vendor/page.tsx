
import type { Metadata } from "next";

import {
    VendorDashboardOverview,
    VendorRouteGuard,
} from "@/features/vendor/components";

export const metadata: Metadata = {
    title: "Vendor Dashboard",
    description: "Manage your PizzaHub menu items and customer orders.",
};

export default function VendorDashboardPage() {
    return (
        <VendorRouteGuard>
            <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <VendorDashboardOverview />
            </main>
        </VendorRouteGuard>
    );
}
