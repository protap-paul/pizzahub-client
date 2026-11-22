import Link from "next/link";
import { Pizza } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                <Pizza className="size-10" />
            </span>

            <p className="mt-8 text-sm font-bold uppercase tracking-widest text-brand-red">
                404
            </p>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                This page is not on the menu
            </h1>

            <p className="mt-4 text-muted-foreground">
                The page you are looking for may have moved, been removed, or never
                existed.
            </p>

            <Button
                render={<Link href="/">Back to Home</Link>}
                className="mt-8 bg-brand-red hover:bg-brand-red/90"
            />
        </main>
    );
}
