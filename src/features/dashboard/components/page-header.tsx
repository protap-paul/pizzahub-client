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
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-red">
                    {eyebrow}
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {action}
        </div>
    );
}
