"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        console.error("PizzaHub page error:", error);
    }, [error]);

    return (
        <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="size-10" />
            </span>

            <h1 className="mt-8 text-3xl font-extrabold sm:text-4xl">
                Something went wrong
            </h1>

            <p className="mt-4 text-muted-foreground">
                We could not load this page. Please try again or return to the
                homepage.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button onClick={reset}>
                    <RotateCcw className="mr-2 size-4" />
                    Try Again
                </Button>

                <Button
                    variant="outline"
                    render={<Link href="/" />}
                >
                    Back to Home
                </Button>
            </div>
        </main>
    );
}
