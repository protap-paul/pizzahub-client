
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Star,
    Store,
    ShoppingBag,
    MessageCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { formatPrice, formatDate } from "@/lib/formatters";
import type { MenuItem } from "@/types/menu-types";

interface MenuDetailsProps {
    item: MenuItem;
}

export function MenuDetails({ item }: MenuDetailsProps) {
    const reviews = item.reviews ?? [];

    return (
        <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-muted sm:min-h-[450px]">
                    {item.images?.[0] ? (
                        <Image
                            src={item.images[0]}
                            alt={item.itemName}
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

                    {item.isFeatured && (
                        <Badge className="absolute left-4 top-4 bg-brand-red text-white">
                            Featured Pizza
                        </Badge>
                    )}
                </div>

                <div className="flex flex-col justify-center space-y-6">
                    <div className="space-y-3">
                        <Badge variant="secondary">{item.category}</Badge>

                        <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                            {item.itemName}
                        </h1>

                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
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
                            <MapPin className="h-4 w-4 text-brand-red" />
                            <span>{item.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Store className="h-4 w-4 text-brand-red" />
                            <span>
                                {item.vendor?.businessName ||
                                    item.vendor?.name ||
                                    "Pizza Vendor"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/menu/${item._id}/order`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-red/90"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            Order Now
                        </Link>

                        <Link
                            href="/menu"
                            className="inline-flex items-center justify-center rounded-lg border px-6 py-3 font-semibold transition-colors hover:bg-muted"
                        >
                            Back to Menu
                        </Link>
                    </div>
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
                            <MessageCircle className="mb-3 h-10 w-10 text-muted-foreground" />
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
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
