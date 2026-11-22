
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Pizza, Store } from "lucide-react";
import { CategorySection } from "@/features/home/components";
import { FeaturedMenuSection } from "@/features/home/components";
import { WhyChooseSection } from "@/features/home/components";
import { VendorCtaSection } from "@/features/home/components";

export default function HomePage() {
    return (
        <>
            {/* Hero Section */}
            <section className="mx-auto flex min-h-[75vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid w-full items-center gap-12 md:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -35 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="inline-flex items-center rounded-full bg-brand-red/10 px-4 py-2 text-sm font-semibold text-brand-red">
                            Freshly Baked, Delivered with Love
                        </span>

                        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Every Slice Has a{" "}
                            <span className="text-brand-red">Story.</span>
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
                            Discover delicious pizzas from local vendors, explore amazing
                            flavors, and get your favorites delivered fresh to your door.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href="/menu"
                                className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-brand-red/90 hover:shadow-xl"
                            >
                                Explore Menu
                                <ArrowRight className="h-5 w-5" />
                            </Link>

                            <Link
                                href="/sign-up"
                                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:bg-accent"
                            >
                                <Store className="h-5 w-5" />
                                Become a Vendor
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex min-h-80 items-center justify-center rounded-3xl bg-brand-orange/10"
                    >
                        <motion.div
                            animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="flex h-52 w-52 items-center justify-center rounded-full bg-brand-red text-white shadow-2xl"
                        >
                            <Pizza className="h-32 w-32" strokeWidth={1.5} />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Popular Categories */}
            <CategorySection />

            {/* Featured Pizzas */}
            <FeaturedMenuSection />

            {/* Why Choose PizzaHub */}
            <WhyChooseSection />

            {/* Become a Vendor */}
            <VendorCtaSection />
        </>
    );
}
