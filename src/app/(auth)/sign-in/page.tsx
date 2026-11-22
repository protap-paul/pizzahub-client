
import { Suspense } from "react";
import Link from "next/link";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    GoogleSignInButton,
    SignInForm,
} from "@/features/auth/components";

export default function SignInPage() {
    return (
        <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-2xl font-bold">
                    Welcome Back!
                </CardTitle>
                <CardDescription>
                    Sign in to your PizzaHub account and enjoy delicious pizza.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                <SignInForm />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>

                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Suspense
                    fallback={
                        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                    }
                >
                    <GoogleSignInButton />
                </Suspense>

                <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="font-semibold text-brand-red hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
