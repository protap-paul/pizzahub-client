
"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { VendorRouteGuard } from "@/features/vendor/components";
import { EditMenuItemForm } from "@/features/vendor/components";
import { Skeleton } from "@/components/ui/skeleton";

function EditMenuItemContent() {
    const params = useParams<{ id: string }>();

    return (
        <VendorRouteGuard>
            <main className="mx-auto max-w-4xl px-4 py-10">
                <Link
                    href="/dashboard/vendor/menu-items"
                    className="mb-6 inline-flex text-sm font-medium text-brand-red hover:underline"
                >
                    ← Back to My Menu Items
                </Link>

                <EditMenuItemForm itemId={params.id} />
            </main>
        </VendorRouteGuard>
    );
}

function EditMenuItemFallback() {
    return (
        <main className="mx-auto max-w-4xl space-y-5 px-4 py-10">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" />
        </main>
    );
}

export default function EditMenuItemPage() {
    return (
        <Suspense fallback={<EditMenuItemFallback />}>
            <EditMenuItemContent />
        </Suspense>
    );
}
