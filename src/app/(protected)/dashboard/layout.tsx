import type { ReactNode } from "react";

import { DashboardShell } from "@/components/shared/layout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <DashboardShell>{children}</DashboardShell>;
}
