import type { Metadata } from "next";

import { CustomerDashboardOverview } from "@/features/customer/components";

export const metadata: Metadata = {
    title: "Customer Dashboard",
    description: "Manage your PizzaHub account and orders.",
};

export default function CustomerDashboardPage() {
    return <CustomerDashboardOverview />;
}
