import type { ReactNode } from "react";

import {
    SiteFooter,
    SiteHeader,
} from "@/components/shared/layout";
import { AuthGuard } from "@/features/auth/components";

export default function PaymentLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <SiteHeader />

            <div className="min-h-screen flex-1 bg-muted/20">
                <AuthGuard>{children}</AuthGuard>
            </div>

            <SiteFooter />
        </>
    );
}
