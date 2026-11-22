import type { Metadata } from "next";

import { MenuManagementTable } from "@/features/admin/components";

export const metadata: Metadata = {
    title: "Manage Menu Items",
    description: "Review and manage all submitted PizzaHub menu items.",
};

export default function AdminMenuItemsPage() {
    return <MenuManagementTable />;
}
