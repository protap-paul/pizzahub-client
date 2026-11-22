
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
    AddMenuItemForm,
    VendorRouteGuard,
} from "@/features/vendor/components";

export const metadata: Metadata = {
    title: "Add Menu Item",
    description: "Add a new pizza to your PizzaHub menu.",
};

export default function AddMenuItemPage() {
    return (
        <VendorRouteGuard>
            <main className="mx-auto min-h-screen max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
                <Link
                    href="/dashboard/vendor/menu-items"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-red"
                >
                    <ArrowLeft className="size-4" />
                    Back to My Menu Items
                </Link>

                <AddMenuItemForm />
            </main>
        </VendorRouteGuard>
    );
}
