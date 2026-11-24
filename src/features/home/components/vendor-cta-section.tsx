
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
    ArrowRight,
    BadgeCheck,
    ClipboardList,
    CreditCard,
    Store,
    UsersRound,
} from "lucide-react";

const benefits = [
    {
        icon: UsersRound,
        title: "Reach more customers",
        description: "Get discovered by pizza lovers in your area.",
    },
    {
        icon: ClipboardList,
        title: "Run your menu easily",
        description: "Update items, prices and availability in seconds.",
    },
    {
        icon: CreditCard,
        title: "Get paid securely",
        description: "Track every order and payment in one place.",
    },
];

export function VendorCtaSection() {
    return (
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#241b17] dark:bg-[#1a1412]"
            >
                {/* Layered warmth: subtle grid, glow and brand gradient. */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_110%_at_100%_0%,rgba(232,121,50,0.22),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]" />
                <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-red/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-brand-orange/15 blur-3xl" />

                <div className="relative z-10 grid items-center gap-12 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:px-16 lg:py-20">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">
                            <Store className="h-4 w-4" />
                            Grow Your Pizza Business
                        </span>

                        <h2 className="mt-6 text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                            Have a pizza business?
                            <span className="mt-2 block text-brand-orange">
                                Put it on the menu.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-xl text-base leading-8 text-white/65">
                            Join PizzaHub to showcase your creations, reach new
                            customers nearby, and manage your entire storefront
                            from one simple dashboard.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                href="/sign-up"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#cf2f2b] px-6 py-3 font-semibold text-white shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-[#b82724]"
                            >
                                Become a Vendor
                                <ArrowRight className="h-5 w-5" />
                            </Link>

                            <Link
                                href="/menu"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                            >
                                Explore the marketplace
                            </Link>
                        </div>

                        <div className="mt-10 grid gap-5 border-t border-white/10 pt-8 sm:grid-cols-3">
                            {benefits.map((benefit) => {
                                const Icon = benefit.icon;

                                return (
                                    <div key={benefit.title}>
                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-orange-200">
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <p className="mt-3 text-sm font-semibold text-white">
                                            {benefit.title}
                                        </p>
                                        <p className="mt-1.5 text-xs leading-5 text-white/55">
                                            {benefit.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative mx-auto w-full max-w-md"
                    >
                        <div className="absolute -inset-4 rounded-[2rem] bg-white/5 blur-2xl" />

                        <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-6">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-red text-white">
                                    <Store className="h-5 w-5" />
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-white">
                                        Your storefront
                                    </p>
                                    <p className="text-xs text-white/50">
                                        Storefront preview
                                    </p>
                                </div>
                                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Live
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/45">
                                        Orders today
                                    </p>
                                    <p className="mt-2 text-2xl font-extrabold text-white">
                                        24
                                    </p>
                                    <p className="mt-1 text-xs text-emerald-300">
                                        +18% this week
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/45">
                                        Revenue
                                    </p>
                                    <p className="mt-2 text-2xl font-extrabold text-white">
                                        BDT 18.4k
                                    </p>
                                    <p className="mt-1 text-xs text-white/50">
                                        This month
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/45">
                                    Top seller
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/20 text-orange-200">
                                        <BadgeCheck className="h-5 w-5" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-white">
                                            Margherita Special
                                        </p>
                                        <p className="text-xs text-white/50">
                                            142 sold this month
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
