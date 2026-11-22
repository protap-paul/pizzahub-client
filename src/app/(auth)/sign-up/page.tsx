
import Link from "next/link";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "@/features/auth/components";

export default function SignUpPage() {
    return (
        <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-2xl font-bold">
                    Create Your Account
                </CardTitle>
                <CardDescription>
                    Join PizzaHub and discover your favorite pizzas.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                <SignUpForm />

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="font-semibold text-brand-red hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
