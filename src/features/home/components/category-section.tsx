
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
    Beef,
    ChefHat,
    Coffee,
    Flame,
    Leaf,
    Utensils,
} from "lucide-react";

import type { MenuCategory } from "@/types/menu-types";

const categories: {
    name: MenuCategory;
    description: string;
    icon: React.ElementType;
}[] = [
        {
            name: "Classic",
            description: "Timeless pizza favorites",
            icon: Flame,
        },
        {
            name: "Vegetarian",
            description: "Fresh and veggie-packed",
            icon: Leaf,
        },
        {
            name: "Meat Lovers",
            description: "Loaded with delicious meat",
            icon: Beef,
        },
        {
            name: "Specialty/Gourmet",
            description: "Unique premium flavors",
            icon: ChefHat,
        },
        {
            name: "Sides/Appetizers",
            description: "Perfect bites on the side",
            icon: Utensils,
        },
        {
            name: "Beverages/Desserts",
            description: "Sweet treats and drinks",
            icon: Coffee,
        },
    ];

export function CategorySection() {
    return (
        <section className="bg-muted/30 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <span className="text-sm font-bold uppercase tracking-widest text-brand-red">
                        Explore Our Menu
                    </span>

                    <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                        Find Your Perfect <span className="text-brand-red">Flavor</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                        From classic favorites to exciting gourmet creations,
                        discover something delicious for every craving.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {categories.map((category, index) => {
                        const Icon = category.icon;

                        return (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                            >
                                <Link
                                    href={`/menu?category=${encodeURIComponent(category.name)}`}
                                    className="group flex h-full flex-col items-center rounded-2xl border bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg"
                                >
                                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
                                        <Icon className="h-7 w-7" />
                                    </span>

                                    <h3 className="mt-4 text-sm font-bold">
                                        {category.name}
                                    </h3>

                                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                        {category.description}
                                    </p>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
