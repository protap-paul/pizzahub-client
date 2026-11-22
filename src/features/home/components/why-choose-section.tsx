
"use client";

import { motion } from "motion/react";
import {
    Clock3,
    HeartHandshake,
    MapPin,
    ShieldCheck,
    Sparkles,
    Truck,
} from "lucide-react";

const benefits = [
    {
        icon: Sparkles,
        title: "Fresh & Delicious",
        description:
            "Enjoy freshly prepared pizzas made with carefully selected ingredients.",
    },
    {
        icon: Truck,
        title: "Reliable Delivery",
        description:
            "Get your favorite pizza delivered conveniently to your doorstep.",
    },
    {
        icon: ShieldCheck,
        title: "Trusted Vendors",
        description:
            "Explore approved local vendors and discover quality food options.",
    },
    {
        icon: Clock3,
        title: "Easy Ordering",
        description:
            "Find your favorite flavors and place your order with just a few clicks.",
    },
    {
        icon: MapPin,
        title: "Local Food Marketplace",
        description:
            "Discover delicious pizza options from vendors in your area.",
    },
    {
        icon: HeartHandshake,
        title: "Supporting Local Businesses",
        description:
            "Connect with local pizza vendors and support their growing businesses.",
    },
];

export function WhyChooseSection() {
    return (
        <section className="bg-muted/30 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <span className="text-sm font-bold uppercase tracking-widest text-brand-red">
                        The PizzaHub Difference
                    </span>

                    <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                        Why Choose <span className="text-brand-red">PizzaHub?</span>
                    </h2>

                    <p className="mt-4 text-muted-foreground">
                        We bring delicious food, trusted local vendors, and a convenient
                        ordering experience together in one place.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;

                        return (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: index * 0.08 }}
                                className="rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand-red/30 hover:shadow-lg"
                            >
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                                    <Icon className="h-6 w-6" />
                                </span>

                                <h3 className="mt-5 text-lg font-bold">
                                    {benefit.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
