import type { Metadata } from "next";

import { VendorOrdersList } from "@/features/vendor/components";

export const metadata: Metadata = {
    title: "Customer Orders",
    description: "Accept or reject customer orders for your pizza business.",
};

export default function VendorOrdersPage() {
    return <VendorOrdersList />;
}
