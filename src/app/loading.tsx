import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-2/3 max-w-md" />
            <Skeleton className="h-4 w-full max-w-lg" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-4 rounded-2xl border p-4">
                        <Skeleton className="h-44 w-full rounded-xl" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-9 w-28" />
                    </div>
                ))}
            </div>
        </main>
    );
}
