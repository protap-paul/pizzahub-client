
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Loader2, Pizza } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { uploadMenuItemImage } from "@/features/menu/services/menu-service";

import { createMenuItem } from "@/features/menu/services/vendor-menu-service";

import type { MenuCategory } from "@/types/menu-types";

const categories: MenuCategory[] = [
    "Classic",
    "Vegetarian",
    "Meat Lovers",
    "Specialty/Gourmet",
    "Sides/Appetizers",
    "Beverages/Desserts",
];

export function AddMenuItemForm() {
    const router = useRouter();

    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState<MenuCategory>("Classic");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!image) {
            toast.error("Please select a pizza image.");
            return;
        }

        if (image.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5 MB.");
            return;
        }

        if (!image.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }

        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            toast.error("Please enter a valid pizza price.");
            return;
        }

        try {
            setIsSubmitting(true);

            toast.info("Uploading pizza image...");

            const uploadResponse = await uploadMenuItemImage(image);
            const imageUrl = uploadResponse.image.url;

            await createMenuItem({
                itemName: itemName.trim(),
                category,
                description: description.trim(),
                price: numericPrice,
                location: location.trim(),
                images: [imageUrl],
            });

            toast.success("Menu item submitted for admin approval!");

            router.push("/dashboard/vendor/menu-items");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create menu item.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mx-auto max-w-3xl">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                        <Pizza className="size-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Add New Menu Item</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Add your delicious pizza to PizzaHub.
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="itemName">Pizza Name</Label>
                        <Input
                            id="itemName"
                            value={itemName}
                            onChange={(event) => setItemName(event.target.value)}
                            placeholder="e.g. Classic Margherita"
                            required
                            minLength={2}
                            maxLength={100}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value as MenuCategory)
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            required
                        >
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Describe your pizza, ingredients, and taste..."
                            required
                            minLength={10}
                            maxLength={1000}
                            rows={5}
                        />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (BDT ৳)</Label>
                            <Input
                                id="price"
                                type="number"
                                min="1"
                                step="0.01"
                                value={price}
                                onChange={(event) => setPrice(event.target.value)}
                                placeholder="650"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={location}
                                onChange={(event) => setLocation(event.target.value)}
                                placeholder="e.g. Dhanmondi, Dhaka"
                                required
                                minLength={2}
                                maxLength={150}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Pizza Image</Label>

                        <label
                            htmlFor="image"
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-input p-8 text-center transition-colors hover:border-brand-red"
                        >
                            <ImagePlus className="mb-3 size-9 text-muted-foreground" />
                            <span className="font-medium">
                                {image ? image.name : "Choose a pizza image"}
                            </span>
                            <span className="mt-1 text-xs text-muted-foreground">
                                JPG, PNG or WebP · Maximum 5 MB
                            </span>
                        </label>

                        <Input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(event) =>
                                setImage(event.target.files?.[0] ?? null)
                            }
                        />
                    </div>

                    <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                        Your menu item will be submitted with pending status. It will
                        appear publicly after admin approval.
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Menu Item"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
