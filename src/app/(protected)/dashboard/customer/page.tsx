
import type { Metadata } from "next";

import {
    CustomerDashboardOverview,
    CustomerRouteGuard,
} from "@/features/customer/components";

export const metadata: Metadata = {
    title: "Customer Dashboard",
    description: "Manage your PizzaHub account and orders.",
};

export default function CustomerDashboardPage() {
    return (
        <CustomerRouteGuard>
            <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <CustomerDashboardOverview />
            </main>
        </CustomerRouteGuard>
    );
}
