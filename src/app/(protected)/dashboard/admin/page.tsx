import type { Metadata } from "next";

import { AdminDashboardOverview } from "@/features/admin/components";

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Monitor the PizzaHub platform from the admin dashboard.",
};

export default function AdminDashboardPage() {
    return <AdminDashboardOverview />;
}
