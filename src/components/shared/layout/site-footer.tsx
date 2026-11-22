import Link from "next/link";
import { Mail, MapPin, Phone, Pizza } from "lucide-react";

import { PUBLIC_NAV_LINKS, SITE_CONFIG } from "@/constants";

function XLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function FacebookLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
        </svg>
    );
}

function InstagramLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5a3.75 3.75 0 0 0 3.75-3.75v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm8.75 2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        </svg>
    );
}

const socialLinks = [
    { label: "X", href: "https://x.com", icon: XLogo },
    {
        label: "Facebook",
        href: "https://facebook.com",
        icon: FacebookLogo,
    },
    {
        label: "Instagram",
        href: "https://instagram.com",
        icon: InstagramLogo,
    },
];

export function SiteFooter() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
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
                        {SITE_CONFIG.description} Discover pizzas from trusted
                        local vendors, order in a few clicks, and enjoy every
                        slice.
                    </p>

                    <div className="mt-5 flex gap-3">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;

                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={social.label}
                                    className="flex size-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-brand-red hover:text-brand-red"
                                >
                                    <Icon className="size-4" />
                                </a>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold">Explore</h3>
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
                        <Link
                            href="/sign-up"
                            className="w-fit text-sm text-muted-foreground transition-colors hover:text-brand-red"
                        >
                            Become a Vendor
                        </Link>
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
                        <Link
                            href="/dashboard/vendor/subscription"
                            className="w-fit text-sm text-muted-foreground hover:text-brand-red"
                        >
                            Vendor Plans
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold">Contact Us</h3>
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                        <p className="flex items-start gap-2">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-brand-red" />
                            Dhaka, Bangladesh
                        </p>
                        <a
                            href="mailto:support@pizzahub.example"
                            className="flex items-center gap-2 hover:text-brand-red"
                        >
                            <Mail className="size-4 text-brand-red" />
                            support@pizzahub.example
                        </a>
                        <a
                            href="tel:+8801700000000"
                            className="flex items-center gap-2 hover:text-brand-red"
                        >
                            <Phone className="size-4 text-brand-red" />
                            +880 1700-000000
                        </a>
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
