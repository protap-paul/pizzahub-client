
import type { ReactNode } from "react";

import {
    SiteFooter,
    SiteHeader,
} from "@/components/shared/layout";

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({
    children,
}: PublicLayoutProps) {
    return (
        <>
            <SiteHeader />

            <main className="min-h-screen flex-1">
                {children}
            </main>

            <SiteFooter />
        </>
    );
}
