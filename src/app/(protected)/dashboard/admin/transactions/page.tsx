import type { Metadata } from "next";

import { TransactionsTable } from "@/features/admin/components";

export const metadata: Metadata = {
    title: "Transactions",
    description: "Review PizzaHub premium subscription transactions.",
};

export default function AdminTransactionsPage() {
    return <TransactionsTable />;
}
