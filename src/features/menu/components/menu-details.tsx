"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Heart,
    MapPin,
    MessageCircle,
    ShoppingBag,
    Star,
    Store,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks";
import {
    addFavorite,
    getMyFavorites,
    removeFavorite,
} from "@/features/favorites/services/favorite-service";
import { formatDate, formatPrice } from "@/lib/formatters";
import type { MenuItem } from "@/types/menu-types";

interface MenuDetailsProps {
    item: MenuItem;
}

export function MenuDetails({ item }: MenuDetailsProps) {
    const { user } = useAuth();

    const images = item.images?.length
        ? item.images
        : [""];
    const [activeImage, setActiveImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    const reviews = item.reviews ?? [];
    const isFeatured = item.isFeatured || item.vendor?.isPremium === true;
    const isCustomer = user?.role === "customer";
    const isOwnItem = Boolean(user?.id && item.vendorId === user.id);
    const canOrder = isCustomer && !isOwnItem;

    useEffect(() => {
        if (!isCustomer) return;

        let isActive = true;

        async function loadFavoriteState() {
            try {
                const response = await getMyFavorites();

                if (isActive) {
                    setIsFavorite(
                        response.favorites.some(
                            (favorite) => favorite._id === item._id
                        )
                    );
                }
            } catch {
                // Favorites are supplementary; the details page still works.
            }
        }

        void loadFavoriteState();

        return () => {
            isActive = false;
        };
    }, [isCustomer, item._id]);

    async function handleFavoriteToggle() {
        try {
            setIsTogglingFavorite(true);

            if (isFavorite) {
                const response = await removeFavorite(item._id);
                toast.success(response.message || "Removed from favorites.");
                setIsFavorite(false);
            } else {
                const response = await addFavorite(item._id);
                toast.success(response.message || "Added to favorites.");
                setIsFavorite(true);
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update favorites."
            );
        } finally {
            setIsTogglingFavorite(false);
        }
    }

    return (
        <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-3">
                    <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-muted sm:min-h-[450px]">
                        {images[activeImage] ? (
                            <Image
                                src={images[activeImage]}
                                alt={`${item.itemName} image ${activeImage + 1}`}
                                fill
                                unoptimized
                                priority
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full min-h-[320px] items-center justify-center text-muted-foreground">
                                Pizza image is not available
                            </div>
                        )}

                        {isFeatured && (
                            <Badge className="absolute left-4 top-4 bg-brand-red text-white">
                                Featured Pizza
                            </Badge>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {images.map((image, index) => (
                                <button
                                    key={`${image}-${index}`}
                                    type="button"
                                    onClick={() => setActiveImage(index)}
                                    aria-label={`View image ${index + 1}`}
                                    className={`relative size-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                        activeImage === index
                                            ? "border-brand-red"
                                            : "border-transparent opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    {image ? (
                                        <Image
                                            src={image}
                                            alt={`${item.itemName} thumbnail ${index + 1}`}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center space-y-6">
                    <div className="space-y-3">
                        <Badge variant="secondary">{item.category}</Badge>

                        <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                            {item.itemName}
                        </h1>

                        <div className="flex items-center gap-2">
                            <Star className="size-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">
                                {item.averageRating
                                    ? item.averageRating.toFixed(1)
                                    : "New"}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                ({item.totalReviews ?? 0} reviews)
                            </span>
                        </div>
                    </div>

                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {item.description}
                    </p>

                    <div className="space-y-3 rounded-xl border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Price</span>
                            <span className="text-3xl font-extrabold text-brand-red">
                                {formatPrice(item.price)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="size-4 text-brand-red" />
                            <span>{item.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Store className="size-4 text-brand-red" />
                            <span>
                                {item.vendor?.businessName ||
                                    item.vendor?.name ||
                                    "Pizza Vendor"}
                                {item.vendor?.isPremium && (
                                    <Badge className="ml-2 bg-brand-orange text-white">
                                        Premium
                                    </Badge>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {canOrder && (
                            <Button
                                size="lg"
                                className="bg-brand-red py-6 text-base font-semibold text-white hover:bg-brand-red/90"
                                render={
                                    <Link href={`/menu/${item._id}/order`} />
                                }
                            >
                                <ShoppingBag className="mr-2 size-5" />
                                Order Now
                            </Button>
                        )}

                        {isCustomer && (
                            <Button
                                size="lg"
                                variant="outline"
                                className="py-6"
                                onClick={() => void handleFavoriteToggle()}
                                disabled={isTogglingFavorite}
                            >
                                <Heart
                                    className={`mr-2 size-5 ${
                                        isFavorite
                                            ? "fill-brand-red text-brand-red"
                                            : ""
                                    }`}
                                />
                                {isFavorite ? "Saved" : "Save to Favorites"}
                            </Button>
                        )}

                        <Button
                            size="lg"
                            variant="outline"
                            className="py-6"
                            render={<Link href="/menu" />}
                        >
                            Back to Menu
                        </Button>
                    </div>

                    {user && !canOrder && (
                        <p className="text-sm text-muted-foreground">
                            {user.role === "vendor"
                                ? "Vendors cannot place customer orders."
                                : user.role === "admin"
                                  ? "Admin accounts cannot place customer orders."
                                  : "You cannot order your own menu item."}
                        </p>
                    )}
                </div>
            </div>

            <section className="space-y-5">
                <div>
                    <h2 className="text-2xl font-bold">Customer Reviews</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        See what customers think about this pizza.
                    </p>
                </div>

                {reviews.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center py-10 text-center">
                            <MessageCircle className="mb-3 size-10 text-muted-foreground" />
                            <h3 className="font-bold">No reviews yet</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Be the first customer to share your experience.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {reviews.map((review, index) => (
                            <Card key={`${review.customerId}-${index}`}>
                                <CardContent className="space-y-3 p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-semibold">
                                            {review.customerName}
                                        </p>

                                        <div className="flex items-center gap-1">
                                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-semibold">
                                                {review.rating}/5
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        {review.comment}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(review.createdAt)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
