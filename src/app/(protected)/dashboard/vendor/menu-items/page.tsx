import type { Metadata } from "next";

import { VendorMenuItemsList } from "@/features/vendor/components";

export const metadata: Metadata = {
    title: "My Menu Items",
    description: "Manage your PizzaHub menu items.",
};

export default function VendorMenuItemsPage() {
    return <VendorMenuItemsList />;
}
