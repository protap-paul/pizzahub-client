import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    accent?: string;
    isLoading?: boolean;
}

export function StatCard({
    label,
    value,
    icon: Icon,
    accent = "text-brand-red",
    isLoading = false,
}: StatCardProps) {
    return (
        <Card className="border-border/70 shadow-sm">
            <CardContent className="flex items-center justify-between gap-3 p-4 sm:gap-4 sm:p-5">
                <div className="min-w-0">
                    <p className="truncate text-xs text-muted-foreground sm:text-sm">
                        {label}
                    </p>

                    {isLoading ? (
                        <Skeleton className="mt-2 h-7 w-14 sm:h-8 sm:w-16" />
                    ) : (
                        <p className="mt-1 truncate text-xl font-extrabold tracking-tight sm:text-2xl">
                            {value}
                        </p>
                    )}
                </div>

                <div className="shrink-0 rounded-lg bg-muted p-2.5 sm:rounded-xl sm:p-3">
                    <Icon className={`size-5 sm:size-6 ${accent}`} />
                </div>
            </CardContent>
        </Card>
    );
}
