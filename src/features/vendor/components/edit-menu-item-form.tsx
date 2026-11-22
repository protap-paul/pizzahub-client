
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    getMyMenuItemById,
    updateMyMenuItem,
} from "@/features/menu/services/vendor-menu-service";
import { uploadMenuItemImage } from "@/features/menu/services/menu-service";
import type { MenuCategory } from "@/types/menu-types";

const categories: MenuCategory[] = [
    "Classic",
    "Vegetarian",
    "Meat Lovers",
    "Specialty/Gourmet",
    "Sides/Appetizers",
    "Beverages/Desserts",
];

interface EditMenuItemFormProps {
    itemId: string;
}

export function EditMenuItemForm({ itemId }: EditMenuItemFormProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState<MenuCategory>("Classic");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [newImage, setNewImage] = useState<File | null>(null);

    useEffect(() => {
        async function loadMenuItem() {
            try {
                const response = await getMyMenuItemById(itemId);
                const item = response.menuItem;

                setItemName(item.itemName);
                setCategory(item.category);
                setDescription(item.description);
                setPrice(String(item.price));
                setLocation(item.location);
                setCurrentImage(item.images?.[0] ?? "");
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to load menu item."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadMenuItem();
    }, [itemId]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!itemName.trim() || !description.trim() || !location.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            toast.error("Please enter a valid price.");
            return;
        }

        setIsSubmitting(true);

        try {
            let imageUrl = currentImage;

            if (newImage) {
                const uploadResponse = await uploadMenuItemImage(newImage);
                imageUrl = uploadResponse.image.url;
            }

            await updateMyMenuItem(itemId, {
                itemName: itemName.trim(),
                category,
                description: description.trim(),
                price: numericPrice,
                location: location.trim(),
                images: imageUrl ? [imageUrl] : [],
            });

            toast.success("Menu item updated successfully!");
            router.push("/dashboard/vendor/menu-items");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update menu item."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="rounded-2xl border p-8 text-center">
                Loading menu item...
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm"
        >
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Pizza Name *
                </label>
                <input
                    required
                    maxLength={100}
                    value={itemName}
                    onChange={(event) => setItemName(event.target.value)}
                    className="w-full rounded-lg border bg-background px-4 py-3"
                    placeholder="Enter pizza name"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Category *
                </label>
                <select
                    value={category}
                    onChange={(event) =>
                        setCategory(event.target.value as MenuCategory)
                    }
                    className="w-full rounded-lg border bg-background px-4 py-3"
                >
                    {categories.map((itemCategory) => (
                        <option key={itemCategory} value={itemCategory}>
                            {itemCategory}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Description *
                </label>
                <textarea
                    required
                    maxLength={2000}
                    rows={5}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="w-full rounded-lg border bg-background px-4 py-3"
                    placeholder="Describe your pizza..."
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Price (BDT) *
                    </label>
                    <input
                        required
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        className="w-full rounded-lg border bg-background px-4 py-3"
                        placeholder="Enter price"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Location *
                    </label>
                    <input
                        required
                        maxLength={200}
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        className="w-full rounded-lg border bg-background px-4 py-3"
                        placeholder="Enter your location"
                    />
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Pizza Image
                </label>

                {currentImage && (
                    <div className="mb-3">
                        <p className="mb-2 text-sm text-muted-foreground">
                            Current image
                        </p>
                        <Image
                            src={currentImage}
                            alt="Current pizza"
                            width={320}
                            height={160}
                            unoptimized
                            className="h-40 w-full max-w-xs rounded-xl object-cover"
                        />
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;

                        if (file && file.size > 5 * 1024 * 1024) {
                            toast.error("Image size must be 5MB or less.");
                            event.target.value = "";
                            return;
                        }

                        setNewImage(file);
                    }}
                    className="w-full rounded-lg border bg-background px-4 py-3"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                    Leave empty to keep the current image. Maximum size: 5MB.
                </p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#e53935] px-6 py-3 font-semibold text-white transition hover:bg-[#c62828] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
        </form>
    );
}
