import type { ReactNode } from "react";

import {
    SiteFooter,
    SiteHeader,
} from "@/components/shared/layout";
import { AuthGuard } from "@/features/auth/components";

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <SiteHeader />

            <main className="min-h-screen flex-1 bg-muted/20">
                <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                    <AuthGuard>{children}</AuthGuard>
                </div>
            </main>

            <SiteFooter />
        </>
    );
}
