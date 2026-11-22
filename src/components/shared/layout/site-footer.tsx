
import Link from "next/link";
import { Pizza } from "lucide-react";

import { PUBLIC_NAV_LINKS, SITE_CONFIG } from "@/constants";

export function SiteFooter() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <Link href="/" className="flex w-fit items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red text-white">
                            <Pizza className="h-6 w-6" />
                        </span>
                        <span className="text-2xl font-extrabold">
                            <span className="text-brand-red">Pizza</span>Hub
                        </span>
                    </Link>

                    <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                        {SITE_CONFIG.description}
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold">Quick Links</h3>
                    <nav className="mt-4 flex flex-col gap-3">
                        {PUBLIC_NAV_LINKS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="w-fit text-sm text-muted-foreground transition-colors hover:text-brand-red"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <h3 className="font-semibold">Get Started</h3>
                    <div className="mt-4 flex flex-col gap-3">
                        <Link
                            href="/sign-in"
                            className="w-fit text-sm text-muted-foreground hover:text-brand-red"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/sign-up"
                            className="w-fit text-sm text-muted-foreground hover:text-brand-red"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t">
                <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
                    © {SITE_CONFIG.name}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
