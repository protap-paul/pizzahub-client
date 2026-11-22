"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { EditMenuItemForm } from "@/features/vendor/components";
import { Skeleton } from "@/components/ui/skeleton";

function EditMenuItemContent() {
    const params = useParams<{ id: string }>();

    return (
        <div className="mx-auto max-w-4xl">
            <Link
                href="/dashboard/vendor/menu-items"
                className="mb-6 inline-flex text-sm font-medium text-brand-red hover:underline"
            >
                ← Back to My Menu Items
            </Link>

            <EditMenuItemForm itemId={params.id} />
        </div>
    );
}

function EditMenuItemFallback() {
    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    );
}

export default function EditMenuItemPage() {
    return (
        <Suspense fallback={<EditMenuItemFallback />}>
            <EditMenuItemContent />
        </Suspense>
    );
}
