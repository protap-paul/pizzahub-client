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
            <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                    <p className="truncate text-sm text-muted-foreground">{label}</p>

                    {isLoading ? (
                        <Skeleton className="mt-2 h-8 w-16" />
                    ) : (
                        <p className="mt-1 text-2xl font-extrabold tracking-tight">
                            {value}
                        </p>
                    )}
                </div>

                <div className="rounded-xl bg-muted p-3">
                    <Icon className={`size-6 ${accent}`} />
                </div>
            </CardContent>
        </Card>
    );
}
