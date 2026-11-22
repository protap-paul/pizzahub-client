
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Pizza, Star } from "lucide-react";

import { getMenuItems } from "@/features/menu/services";
import { formatPrice } from "@/lib/formatters";
import type { MenuItem } from "@/types/menu-types";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedMenuSection() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadFeaturedItems() {
            try {
                const response = await getMenuItems({
                    limit: 6,
                    sort: "newest",
                });

                setItems(response.data);
            } catch (error) {
                console.error("Failed to load featured menu items:", error);
            } finally {
                setIsLoading(false);
            }
        }

        void loadFeaturedItems();
    }, []);

    return (
        <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-widest text-brand-red">
                            Customer Favorites
                        </span>

                        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                            Our <span className="text-brand-red">Featured Pizzas</span>
                        </h2>

                        <p className="mt-3 max-w-xl text-muted-foreground">
                            Explore delicious pizzas prepared by our local vendors.
                        </p>
                    </div>

                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
                    >
                        View All
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Card key={index} className="overflow-hidden">
                                <Skeleton className="h-52 w-full" />
                                <CardContent className="space-y-3 p-5">
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-6 w-1/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed py-16 text-center">
                        <Pizza className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">
                            No Pizzas Available Yet
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Delicious pizzas will appear here once vendors publish them.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <Card
                                key={item._id}
                                className="group overflow-hidden border-border/70 transition-all hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative h-52 overflow-hidden bg-muted">
                                    {item.images[0] ? (
                                        <Image
                                            src={item.images[0]}
                                            alt={item.itemName}
                                            fill
                                            unoptimized
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Pizza className="h-16 w-16 text-muted-foreground" />
                                        </div>
                                    )}

                                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                                        {item.category}
                                    </span>
                                </div>

                                <CardContent className="space-y-3 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-lg font-bold transition-colors group-hover:text-brand-red">
                                            {item.itemName}
                                        </h3>

                                        {item.averageRating !== undefined &&
                                            item.totalReviews !== undefined &&
                                            item.totalReviews > 0 && (
                                                <span className="flex shrink-0 items-center gap-1 text-sm font-semibold">
                                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                    {item.averageRating.toFixed(1)}
                                                </span>
                                            )}
                                    </div>

                                    <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between border-t pt-4">
                                        <span className="text-lg font-extrabold text-brand-red">
                                            {formatPrice(item.price)}
                                        </span>

                                        <Link
                                            href={`/menu/${item._id}`}
                                            className="rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-red/90"
                                        >
                                            View Details
                                        </Link>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        {item.vendor?.businessName || item.vendor?.name || "PizzaHub Vendor"}
                                        {" · "}
                                        {item.location}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
