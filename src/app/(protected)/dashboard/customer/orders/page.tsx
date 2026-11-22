import type { Metadata } from "next";

import { MyOrdersList } from "@/features/customer/components";

export const metadata: Metadata = {
    title: "My Orders",
    description: "Track and manage your PizzaHub orders.",
};

export default function CustomerOrdersPage() {
    return <MyOrdersList />;
}
