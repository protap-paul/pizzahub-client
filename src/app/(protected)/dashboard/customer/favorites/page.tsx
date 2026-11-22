import type { Metadata } from "next";

import { PageHeader } from "@/features/dashboard/components";
import { FavoritesList } from "@/features/favorites/components";

export const metadata: Metadata = {
    title: "My Favorites",
    description: "Pizzas you saved for later on PizzaHub.",
};

export default function CustomerFavoritesPage() {
    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Customer Workspace"
                title="My Favorites"
                description="Quickly get back to the pizzas you saved."
            />

            <FavoritesList />
        </section>
    );
}
