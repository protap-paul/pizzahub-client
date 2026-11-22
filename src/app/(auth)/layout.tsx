
import Link from "next/link";
import { Pizza } from "lucide-react";

import { SITE_CONFIG } from "@/constants/site";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({
    children,
}: AuthLayoutProps) {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-cream px-4 py-10 dark:bg-background">
            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-orange/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl" />

            <div className="relative z-10 w-full max-w-md">
                <Link
                    href="/"
                    className="mb-8 flex items-center justify-center gap-2"
                >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red text-white shadow-lg">
                        <Pizza className="h-7 w-7" />
                    </span>

                    <span className="text-3xl font-extrabold tracking-tight">
                        <span className="text-brand-red">Pizza</span>
                        <span className="text-brand-dark dark:text-white">Hub</span>
                    </span>
                </Link>

                {children}

                <p className="mt-8 text-center text-xs text-muted-foreground">
                    © {SITE_CONFIG.name}. Delicious Pizza, Delivered Fresh.
                </p>
            </div>
        </main>
    );
}
