import type { ReactNode } from "react";

interface PageHeaderProps {
    eyebrow: string;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function PageHeader({
    eyebrow,
    title,
    description,
    action,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-red sm:text-sm">
                    {eyebrow}
                </p>
                <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:mt-2 sm:text-3xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <div className="flex shrink-0 flex-wrap gap-2">{action}</div>
            )}
        </div>
    );
}
