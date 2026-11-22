
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { MenuFilterBar } from "./menu-filter-bar";
import { getMenuItems } from "@/features/menu/services/menu-service";
import { formatPrice } from "@/lib/formatters";

import type { MenuItem, MenuFilters } from "@/types/menu-types";

export function MenuListing() {
    const [filters, setFilters] = useState<MenuFilters>({
        sort: "newest",
        page: 1,
        limit: 12,
    });

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isActive = true;

        async function fetchMenuItems() {
            try {
                setIsLoading(true);
                setError("");

                const response = await getMenuItems(filters);

                if (isActive) {
                    setMenuItems(response.data);
                }
            } catch (err) {
                if (isActive) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load menu items.",
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        fetchMenuItems();

        return () => {
            isActive = false;
        };
    }, [filters]);

    return (
        <section className="space-y-8">
            <MenuFilterBar onFiltersChange={setFilters} />

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold sm:text-2xl">
                    Explore Our Pizzas
                </h2>

                {!isLoading && (
                    <p className="text-sm text-muted-foreground">
                        {menuItems.length} items found
                    </p>
                )}
            </div>

            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                            <Skeleton className="h-56 w-full" />
                            <CardContent className="space-y-3 p-5">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-6 w-1/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                    <p className="font-semibold text-destructive">{error}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Please try changing your filters or refreshing the page.
                    </p>
                </div>
            ) : menuItems.length === 0 ? (
                <div className="rounded-xl border border-dashed p-12 text-center">
                    <h3 className="text-xl font-bold">No pizzas found!</h3>
                    <p className="mt-2 text-muted-foreground">
                        Try another search term or change your filters.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {menuItems.map((item) => (
                        <Card
                            key={item._id}
                            className="group overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="relative h-56 overflow-hidden bg-muted">
                                {item.images?.[0] ? (
                                    <Image
                                        src={item.images[0]}
                                        alt={item.itemName}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                        No image available
                                    </div>
                                )}

                                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                                    {item.category}
                                </span>
                            </div>

                            <CardContent className="space-y-3 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-lg font-bold">{item.itemName}</h3>

                                    <div className="flex shrink-0 items-center gap-1 text-sm">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span>
                                            {item.averageRating
                                                ? item.averageRating.toFixed(1)
                                                : "New"}
                                        </span>
                                    </div>
                                </div>

                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {item.description}
                                </p>

                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-brand-red" />
                                    <span>{item.location}</span>
                                </div>

                                <div className="flex items-center justify-between border-t pt-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Price</p>
                                        <p className="text-lg font-extrabold text-brand-red">
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/menu/${item._id}`}
                                        className="rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-red/90"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
