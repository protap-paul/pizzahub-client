"use client";

import { motion } from "motion/react";
import { ClipboardList, Search, ShoppingBag, UtensilsCrossed } from "lucide-react";

const steps = [
    {
        icon: Search,
        number: "01",
        title: "Explore the Menu",
        description:
            "Browse pizzas from approved local vendors. Search by name, filter by category or location, and sort by price.",
    },
    {
        icon: ShoppingBag,
        number: "02",
        title: "Place Your Order",
        description:
            "Pick a pizza, choose your delivery date, add your address, and submit your order in a few simple steps.",
    },
    {
        icon: ClipboardList,
        number: "03",
        title: "Track Your Status",
        description:
            "Follow your order from pending to accepted with a clear status timeline in your customer dashboard.",
    },
    {
        icon: UtensilsCrossed,
        number: "04",
        title: "Enjoy Your Pizza",
        description:
            "Your vendor prepares the order and delivers it fresh. It really is that simple.",
    },
];

export function HowItWorksSection() {
    return (
        <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="text-sm font-bold uppercase tracking-widest text-brand-red">
                        Simple & Delicious
                    </span>

                    <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                        How PizzaHub{" "}
                        <span className="text-brand-red">Works</span>
                    </h2>

                    <p className="mt-4 text-muted-foreground">
                        From browsing to biting, we make it easy to get great pizza
                        from the vendors you love.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.45,
                                    delay: index * 0.1,
                                }}
                                className="relative text-center"
                            >
                                {index < steps.length - 1 && (
                                    <span className="absolute left-[calc(50%+3rem)] top-8 hidden w-[calc(100%-6rem)] border-t-2 border-dashed border-brand-red/20 lg:block" />
                                )}

                                <div className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-brand-red text-white shadow-lg">
                                    <Icon className="size-7" />
                                    <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-background bg-brand-orange text-[10px] font-bold">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="mt-6 text-lg font-bold">
                                    {step.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                    {step.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
