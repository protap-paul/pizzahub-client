
import Link from "next/link";
import { Pizza } from "lucide-react";

import { PUBLIC_NAV_LINKS } from "@/constants";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red text-white">
                        <Pizza className="h-6 w-6" />
                    </span>

                    <span className="text-2xl font-extrabold tracking-tight">
                        <span className="text-brand-red">Pizza</span>
                        <span>Hub</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {PUBLIC_NAV_LINKS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand-red"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        href="/sign-in"
                        className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/sign-up"
                        className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-red/90"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
