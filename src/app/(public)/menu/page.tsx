
import type { Metadata } from "next";

import { MenuListing } from "@/features/menu/components";

export const metadata: Metadata = {
    title: "Browse Menu",
    description:
        "Explore delicious pizzas from trusted local vendors on PizzaHub.",
};

export default function BrowseMenuPage() {
    return (
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
                <span className="text-sm font-bold uppercase tracking-widest text-brand-red">
                    Explore Our Collection
                </span>

                <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">
                    Browse Our <span className="text-brand-red">Menu</span>
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                    Discover delicious pizzas from trusted local vendors.
                    Find your favorite flavor and enjoy every bite.
                </p>
            </div>

            <MenuListing />
        </main>
    );
}
