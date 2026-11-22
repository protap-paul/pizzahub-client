
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Store } from "lucide-react";

export function VendorCtaSection() {
    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-brand-dark px-6 py-16 text-white sm:px-12 lg:px-20"
            >
                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-red/30 blur-3xl" />

                <div className="relative z-10 grid items-center gap-10 md:grid-cols-2">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-orange-300">
                            <Store className="h-4 w-4" />
                            Grow Your Pizza Business
                        </span>

                        <h2 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
                            Have a Pizza Business?
                            <span className="mt-2 block text-orange-400">
                                Join PizzaHub Today!
                            </span>
                        </h2>

                        <p className="mt-5 max-w-lg leading-8 text-white/70">
                            Connect with pizza lovers, showcase your delicious creations,
                            and grow your local food business with PizzaHub.
                        </p>

                        <Link
                            href="/sign-up"
                            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-red px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-red/90"
                        >
                            Become a Vendor
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex h-48 w-48 items-center justify-center rounded-full border border-white/15 bg-white/10 sm:h-60 sm:w-60">
                            <Store className="h-24 w-24 text-orange-400 sm:h-32 sm:w-32" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
