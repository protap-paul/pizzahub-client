
import type { Metadata } from "next";

import {
    CustomerRouteGuard,
    MyOrdersList,
} from "@/features/customer/components";

export const metadata: Metadata = {
    title: "My Orders",
    description: "Track and manage your PizzaHub orders.",
};

export default function CustomerOrdersPage() {
    return (
        <CustomerRouteGuard>
            <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <MyOrdersList />
            </main>
        </CustomerRouteGuard>
    );
}
