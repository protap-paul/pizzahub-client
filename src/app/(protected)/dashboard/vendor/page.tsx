import type { Metadata } from "next";

import {
    VendorDashboardOverview,
} from "@/features/vendor/components";

export const metadata: Metadata = {
    title: "Vendor Dashboard",
    description: "Manage your PizzaHub menu items and customer orders.",
};

export default function VendorDashboardPage() {
    return <VendorDashboardOverview />;
}
