"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Crown, Loader2, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { APP_ROUTES } from "@/constants/routes";
import { PageHeader } from "@/features/dashboard/components";
import { getMyProfile } from "@/features/profile/services/profile-service";
import {
    cancelPremiumSubscription,
    createCheckoutSession,
} from "@/features/subscriptions/services/subscription-service";
import { formatDate } from "@/lib/formatters";
import type { SubscriptionPlan } from "@/types/auth-types";

const features = {
    free: [
        "Up to 3 active menu items",
        "Basic vendor dashboard",
        "Customer order management",
    ],
    premium: [
        "Unlimited active menu items",
        "Premium vendor badge",
        "Featured menu placement",
        "Everything in the Free plan",
    ],
} as const;

function SubscriptionManagerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [plan, setPlan] = useState<SubscriptionPlan>("free");
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const isPremium = plan === "premium";
    const hasSuccessParam = searchParams.get("success") === "true";
    const hasCancelParam = searchParams.get("cancelled") === "true";
    const sessionId = searchParams.get("session_id");

    const refreshPlan = useCallback(async (showToast = false) => {
        try {
            setIsRefreshing(true);
            const response = await getMyProfile();
            setPlan(response.user.subscriptionPlan ?? "free");
            setExpiresAt(response.user.subscriptionExpiresAt ?? null);

            if (showToast) {
                toast.success("Subscription status refreshed.");
            }

            return response.user.subscriptionPlan ?? "free";
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to verify subscription status."
            );
            return null;
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(() => refreshPlan());
    }, [refreshPlan]);

    // Stripe returns to the subscription page with a query string. Move the
    // user to the dedicated result pages, which verify the plan from the API
    // after the server has processed the webhook.
    useEffect(() => {
        if (hasSuccessParam) {
            const target = sessionId
                ? `${APP_ROUTES.PAYMENT_SUCCESS}?session_id=${encodeURIComponent(sessionId)}`
                : APP_ROUTES.PAYMENT_SUCCESS;

            router.replace(target);
            return;
        }

        if (hasCancelParam) {
            router.replace(APP_ROUTES.PAYMENT_CANCEL);
        }
    }, [hasCancelParam, hasSuccessParam, router, sessionId]);

    async function handleUpgrade() {
        try {
            setIsCheckingOut(true);
            const response = await createCheckoutSession();
            window.location.assign(response.url);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to start Stripe checkout."
            );
            setIsCheckingOut(false);
        }
    }

    async function handleCancelSubscription() {
        try {
            setIsCancelling(true);
            const response = await cancelPremiumSubscription();
            toast.success(response.message);
            await refreshPlan();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to cancel subscription."
            );
        } finally {
            setIsCancelling(false);
        }
    }

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Vendor Workspace"
                title="Subscription"
                description="Choose the plan that fits your pizza business."
                action={
                    <Button
                        variant="outline"
                        onClick={() => void refreshPlan(true)}
                        disabled={isRefreshing}
                    >
                        <RefreshCw
                            className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        Refresh Status
                    </Button>
                }
            />

            {hasSuccessParam && (
                <Card className="border-amber-500/30 bg-amber-500/5">
                    <CardContent className="flex items-start gap-3 p-5">
                        <Loader2 className="mt-0.5 size-5 animate-spin text-amber-600" />
                        <div>
                            <h2 className="font-bold">Verifying your payment</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Premium is activated only after Stripe sends a verified
                                webhook to the server. We are checking your account
                                status now.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {hasCancelParam && (
                <Card className="border-muted">
                    <CardContent className="flex items-start gap-3 p-5">
                        <XCircle className="mt-0.5 size-5 text-muted-foreground" />
                        <div>
                            <h2 className="font-bold">Checkout cancelled</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                No payment was made and your current plan is unchanged.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="border-brand-red/20 bg-gradient-to-r from-brand-red/10 to-brand-orange/10">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Your current plan
                        </p>
                        {isLoading ? (
                            <Skeleton className="mt-2 h-9 w-32" />
                        ) : (
                            <div className="mt-2 flex items-center gap-3">
                                <h2 className="text-3xl font-extrabold capitalize">
                                    {plan}
                                </h2>
                                <Badge variant={isPremium ? "default" : "secondary"}>
                                    {isPremium ? "Premium" : "Free"}
                                </Badge>
                            </div>
                        )}
                        {expiresAt && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                {isPremium
                                    ? `Active until ${formatDate(expiresAt)}`
                                    : `Access ends ${formatDate(expiresAt)}`}
                            </p>
                        )}
                    </div>

                    {isPremium && (
                        <Button
                            variant="outline"
                            onClick={() => void handleCancelSubscription()}
                            disabled={isCancelling || isLoading}
                        >
                            {isCancelling ? "Cancelling..." : "Cancel Renewal"}
                        </Button>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {(
                    [
                        {
                            key: "free" as const,
                            title: "Free",
                            price: "৳0",
                            description: "Start your pizza business on PizzaHub.",
                            action: "Current Plan",
                            disabled: true,
                        },
                        {
                            key: "premium" as const,
                            title: "Premium",
                            price: "Subscription",
                            description: "Grow faster with more visibility.",
                            action: isPremium
                                ? "Premium Active"
                                : "Upgrade to Premium",
                            disabled: isPremium,
                        },
                    ]
                ).map((option) => (
                    <Card
                        key={option.key}
                        className={
                            option.key === "premium"
                                ? "border-brand-red shadow-lg"
                                : ""
                        }
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">
                                    {option.title}
                                </CardTitle>
                                {option.key === "premium" && (
                                    <Crown className="size-6 text-brand-orange" />
                                )}
                            </div>
                            <p className="text-3xl font-extrabold text-brand-red">
                                {option.price}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {option.description}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <ul className="space-y-3">
                                {features[option.key].map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {option.key === "premium" && (
                                <Button
                                    className="w-full bg-brand-red hover:bg-brand-red/90"
                                    onClick={() => void handleUpgrade()}
                                    disabled={option.disabled || isCheckingOut || isLoading}
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                            Opening Stripe Checkout...
                                        </>
                                    ) : (
                                        option.action
                                    )}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <p className="text-center text-xs text-muted-foreground">
                Payments are processed securely by Stripe. Premium access is enabled
                only after the server verifies the payment webhook.
            </p>
        </section>
    );
}

function SubscriptionManagerFallback() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="h-80 w-full rounded-xl" />
                <Skeleton className="h-80 w-full rounded-xl" />
            </div>
        </div>
    );
}

export function SubscriptionManager() {
    return (
        <Suspense fallback={<SubscriptionManagerFallback />}>
            <SubscriptionManagerContent />
        </Suspense>
    );
}
