"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, RefreshCw, Store } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
    getMyFavorites,
    removeFavorite,
} from "@/features/favorites/services/favorite-service";
import { getMenuItems } from "@/features/menu/services/menu-service";
import { formatPrice } from "@/lib/formatters";
import type { MenuItem } from "@/types/menu-types";

function FavoritesSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                    key={index}
                    className="h-80 w-full rounded-xl"
                />
            ))}
        </div>
    );
}

async function fetchPublicMenuLookup() {
    const firstPage = await getMenuItems({ page: 1, limit: 50 });
    const lookup = new Map<string, MenuItem>(
        firstPage.data.map((item) => [item._id, item])
    );

    for (
        let currentPage = 2;
        currentPage <= firstPage.pagination.totalPages;
        currentPage += 1
    ) {
        const response = await getMenuItems({ page: currentPage, limit: 50 });

        response.data.forEach((item) => lookup.set(item._id, item));
    }

    return lookup;
}

export function FavoritesList() {
    const [favorites, setFavorites] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState<string | null>(null);

    const loadFavorites = useCallback(async () => {
        try {
            setIsLoading(true);
            const [favoriteResponse, menuLookupResult] = await Promise.all([
                getMyFavorites(),
                fetchPublicMenuLookup().catch(() => new Map<string, MenuItem>()),
            ]);

            const enrichedFavorites = (favoriteResponse.favorites ?? []).map(
                (favorite) => ({
                    ...favorite,
                    vendor:
                        favorite.vendor ??
                        menuLookupResult.get(favorite._id)?.vendor,
                })
            );

            setFavorites(enrichedFavorites);
            setError("");
        } catch (loadError) {
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Failed to load your favorites."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(loadFavorites);
    }, [loadFavorites]);

    const handleRemove = async (itemId: string) => {
        try {
            setRemovingId(itemId);
            const response = await removeFavorite(itemId);
            setFavorites((current) =>
                current.filter((item) => item._id !== itemId)
            );
            toast.success(response.message || "Favorite removed.");
        } catch (removeError) {
            toast.error(
                removeError instanceof Error
                    ? removeError.message
                    : "Failed to remove this favorite."
            );
        } finally {
            setRemovingId(null);
        }
    };

    if (isLoading) return <FavoritesSkeleton />;

    if (error) {
        return (
            <Card className="border-destructive/30">
                <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                    <p className="font-semibold text-destructive">{error}</p>
                    <Button
                        variant="outline"
                        onClick={() => void loadFavorites()}
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (favorites.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center py-16 text-center">
                    <Heart className="mb-4 size-12 text-brand-red" />
                    <h2 className="text-xl font-bold">No favorites yet</h2>
                    <p className="mt-2 max-w-sm text-muted-foreground">
                        Save pizzas you love by adding them to your favorites,
                        then find them here.
                    </p>
                    <Button
                        className="mt-6 bg-brand-red hover:bg-brand-red/90"
                        render={<Link href="/menu" />}
                    >
                        Browse Menu
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((item) => (
                <Card
                    key={item._id}
                    className="flex h-full flex-col overflow-hidden"
                >
                    <div className="relative h-44 bg-muted">
                        {item.images?.[0] ? (
                            <Image
                                src={item.images[0]}
                                alt={item.itemName}
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Image not available
                            </div>
                        )}
                    </div>

                    <CardContent className="flex flex-1 flex-col gap-3 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <Badge variant="secondary">{item.category}</Badge>
                            <span className="text-lg font-extrabold text-brand-red">
                                {formatPrice(item.price)}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold">{item.itemName}</h3>

                        <div className="space-y-1.5 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                                <MapPin className="size-4 text-brand-red" />
                                {item.location}
                            </p>
                            <p className="flex items-center gap-2">
                                <Store className="size-4 text-brand-red" />
                                {item.vendor?.businessName ||
                                    item.vendor?.name ||
                                    "Pizza Vendor"}
                            </p>
                        </div>

                        <div className="mt-auto flex flex-col gap-2 pt-2">
                            <Button
                                className="w-full bg-brand-red hover:bg-brand-red/90"
                                render={
                                    <Link href={`/menu/${item._id}`} />
                                }
                            >
                                View Details
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled={removingId === item._id}
                                onClick={() => void handleRemove(item._id)}
                            >
                                {removingId === item._id
                                    ? "Removing..."
                                    : "Remove Favorite"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
