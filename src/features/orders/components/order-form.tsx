
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, MapPin, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createOrder } from "@/features/orders/services/customer-order-service";
import { formatPrice } from "@/lib/formatters";
import { useAuth } from "@/features/auth/hooks";

import type { MenuItem } from "@/types/menu-types";

interface OrderFormProps {
    item: MenuItem;
}

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function OrderForm({ item }: OrderFormProps) {
    const router = useRouter();
    const { user } = useAuth();

    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isCustomer = user?.role === "customer";
    const isOwnItem = Boolean(user?.id && item.vendorId === user.id);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!isCustomer) {
            toast.error("Only customers can place orders.");
            return;
        }

        if (isOwnItem) {
            toast.error("You cannot order your own pizza.");
            return;
        }

        if (!deliveryDate || !deliveryAddress.trim()) {
            toast.error("Please complete all required fields.");
            return;
        }

        if (deliveryDate < getTodayDate()) {
            toast.error("Please select a valid delivery date.");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await createOrder({
                itemId: item._id,
                deliveryDate,
                deliveryAddress: deliveryAddress.trim(),
                message: message.trim(),
            });

            toast.success(response.message || "Your order has been placed!");

            router.push("/dashboard/customer/orders");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to place your order.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isCustomer || isOwnItem) {
        return (
            <Card>
                <CardContent className="py-8 text-center">
                    <h2 className="text-xl font-bold">Ordering unavailable</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {!isCustomer
                            ? "Only customer accounts can place pizza orders."
                            : "You cannot order your own menu item."}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mx-auto w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Complete Your Order
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Enter your delivery information to place your order.
                </p>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border bg-muted/30 p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-bold">{item.itemName}</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {item.category}
                                </p>
                            </div>

                            <p className="text-xl font-extrabold text-brand-red">
                                {formatPrice(item.price)}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deliveryDate">
                            Delivery Date <span className="text-destructive">*</span>
                        </Label>

                        <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="deliveryDate"
                                type="date"
                                min={getTodayDate()}
                                value={deliveryDate}
                                onChange={(event) => setDeliveryDate(event.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deliveryAddress">
                            Delivery Address <span className="text-destructive">*</span>
                        </Label>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                                id="deliveryAddress"
                                value={deliveryAddress}
                                onChange={(event) => setDeliveryAddress(event.target.value)}
                                placeholder="Enter your complete delivery address..."
                                className="min-h-24 pl-10"
                                maxLength={300}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Additional Message (Optional)</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Any special instructions for your order?"
                            maxLength={500}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-red py-6 text-base font-bold text-white hover:bg-brand-red/90"
                    >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        {isSubmitting ? "Placing Order..." : "Place Order"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                        Your order will be submitted with pending status.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
