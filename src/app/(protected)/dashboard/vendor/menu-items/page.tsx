
import type { Metadata } from "next";

import {
    VendorMenuItemsList,
    VendorRouteGuard,
} from "@/features/vendor/components";

export const metadata: Metadata = {
    title: "My Menu Items",
    description: "Manage your PizzaHub menu items.",
};

export default function VendorMenuItemsPage() {
    return (
        <VendorRouteGuard>
            <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <VendorMenuItemsList />
            </main>
        </VendorRouteGuard>
    );
}
