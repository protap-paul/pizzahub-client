"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    CheckCircle2,
    Crown,
    Loader2,
    XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMyProfile } from "@/features/profile/services/profile-service";
import { formatDate } from "@/lib/formatters";
import type { SubscriptionPlan } from "@/types/auth-types";

interface PaymentResultProps {
    variant: "success" | "cancel";
}

function SuccessContent() {
    const router = useRouter();

    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [isChecking, setIsChecking] = useState(true);

    const checkPlan = useCallback(async () => {
        setIsChecking(true);

        try {
            const response = await getMyProfile();
            const currentPlan = response.user.subscriptionPlan ?? "free";

            setPlan(currentPlan);
            setExpiresAt(response.user.subscriptionExpiresAt ?? null);

            if (currentPlan === "premium") {
                toast.success("Premium subscription is active. Thank you!");
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to verify your subscription status."
            );
        } finally {
            setIsChecking(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(checkPlan);
    }, [checkPlan, attempts]);

    const isPremium = plan === "premium";
    const canRetry = attempts < 3;

    return (
        <Card className="overflow-hidden border-brand-red/20 bg-gradient-to-b from-brand-red/5 to-transparent">
            <CardContent className="flex flex-col items-center px-6 py-12 text-center sm:px-10">
                <span
                    className={`flex h-20 w-20 items-center justify-center rounded-full ${
                        isPremium
                            ? "bg-green-500/10 text-green-600"
                            : "bg-amber-500/10 text-amber-600"
                    }`}
                >
                    {isChecking || (!isPremium && canRetry) ? (
                        <Loader2 className="size-10 animate-spin" />
                    ) : isPremium ? (
                        <CheckCircle2 className="size-10" />
                    ) : (
                        <Crown className="size-10" />
                    )}
                </span>

                <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">
                    {isPremium
                        ? "Your Premium Plan Is Active!"
                        : "We're Confirming Your Payment"}
                </h1>

                <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
                    {isPremium
                        ? "Thank you for upgrading. You can now publish unlimited menu items, display the Premium badge, and receive featured placement on the homepage."
                        : "Premium access is enabled only after Stripe sends a verified webhook to our server. This usually takes a few seconds. Please keep this page open while we confirm."}
                </p>

                {isPremium && expiresAt && (
                    <p className="mt-4 rounded-full bg-brand-red/10 px-4 py-2 text-sm font-semibold text-brand-red">
                        Premium active until {formatDate(expiresAt)}
                    </p>
                )}

                <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
                    {isPremium ? (
                        <Button
                            className="w-full bg-brand-red hover:bg-brand-red/90"
                            render={<Link href="/dashboard/vendor" />}
                        >
                            Go to Dashboard
                            <ArrowRight className="ml-2 size-4" />
                        </Button>
                    ) : (
                        <Button
                            className="w-full bg-brand-red hover:bg-brand-red/90"
                            onClick={() => {
                                if (canRetry) setAttempts((value) => value + 1);
                                else router.push("/dashboard/vendor/subscription");
                            }}
                            disabled={isChecking}
                        >
                            {isChecking
                                ? "Checking Status..."
                                : canRetry
                                  ? "Check Again"
                                  : "View Subscription"}
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="w-full"
                        render={<Link href="/dashboard/vendor/subscription" />}
                    >
                        Manage Subscription
                    </Button>
                </div>

                {!isPremium && canRetry && (
                    <p className="mt-4 text-xs text-muted-foreground">
                        Attempt {attempts + 1} of 3
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function CancelContent() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center px-6 py-12 text-center sm:px-10">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <XCircle className="size-10" />
                </span>

                <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">
                    Checkout Cancelled
                </h1>

                <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
                    No payment was made and your current plan has not changed.
                    You can continue with your existing plan or try the upgrade
                    again whenever you&apos;re ready.
                </p>

                <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
                    <Button
                        className="w-full bg-brand-red hover:bg-brand-red/90"
                        render={<Link href="/dashboard/vendor/subscription" />}
                    >
                        Back to Subscription
                        <ArrowRight className="ml-2 size-4" />
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full"
                        render={<Link href="/dashboard/vendor" />}
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function PaymentResult({ variant }: PaymentResultProps) {
    return (
        <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12 sm:px-6 lg:px-8">
            {variant === "success" ? <SuccessContent /> : <CancelContent />}
        </main>
    );
}
