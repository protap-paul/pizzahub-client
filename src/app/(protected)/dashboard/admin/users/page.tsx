import type { Metadata } from "next";

import { UserManagementTable } from "@/features/admin/components";

export const metadata: Metadata = {
    title: "Manage Users",
    description: "Search and manage PizzaHub customers and vendors.",
};

export default function AdminUsersPage() {
    return <UserManagementTable />;
}
