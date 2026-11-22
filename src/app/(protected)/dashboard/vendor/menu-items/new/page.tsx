import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AddMenuItemForm } from "@/features/vendor/components";

export const metadata: Metadata = {
    title: "Add Menu Item",
    description: "Add a new pizza to your PizzaHub menu.",
};

export default function AddMenuItemPage() {
    return (
        <div className="space-y-8">
            <Link
                href="/dashboard/vendor/menu-items"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-red"
            >
                <ArrowLeft className="size-4" />
                Back to My Menu Items
            </Link>

            <AddMenuItemForm />
        </div>
    );
}
