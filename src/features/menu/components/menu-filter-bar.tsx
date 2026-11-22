
"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { MenuCategory, MenuFilters } from "@/types/menu-types";

const categories: MenuCategory[] = [
    "Classic",
    "Vegetarian",
    "Meat Lovers",
    "Specialty/Gourmet",
    "Sides/Appetizers",
    "Beverages/Desserts",
];

interface MenuFilterBarProps {
    onFiltersChange: (filters: MenuFilters) => void;
}

export function MenuFilterBar({
    onFiltersChange,
}: MenuFilterBarProps) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [location, setLocation] = useState("");
    const [sort, setSort] = useState<MenuFilters["sort"]>("newest");

    function updateFilters(
        updates: Partial<{
            search: string;
            category: string;
            location: string;
            sort: MenuFilters["sort"];
        }>,
    ) {
        const next = {
            search,
            category,
            location,
            sort,
            ...updates,
        };

        onFiltersChange({
            search: next.search,
            category:
                next.category === "all"
                    ? undefined
                    : (next.category as MenuCategory),
            location: next.location || undefined,
            sort: next.sort,
        });
    }

    return (
        <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-brand-red" />
                <h2 className="font-bold">Find Your Favorite Pizza</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => {
                            const value = event.target.value;
                            setSearch(value);
                            updateFilters({ search: value });
                        }}
                        placeholder="Search pizza name..."
                        className="pl-9"
                    />
                </div>

                <Select
                    value={category}
                    onValueChange={(value) => {
                        const nextCategory = value ?? "all";
                        setCategory(nextCategory);
                        updateFilters({ category: nextCategory });
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((item) => (
                            <SelectItem key={item} value={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    value={location}
                    onChange={(event) => {
                        const value = event.target.value;
                        setLocation(value);
                        updateFilters({ location: value });
                    }}
                    placeholder="Search by location..."
                />

                <Select
                    value={sort}
                    onValueChange={(value) => {
                        const nextSort = value as MenuFilters["sort"];
                        setSort(nextSort);
                        updateFilters({ sort: nextSort });
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
