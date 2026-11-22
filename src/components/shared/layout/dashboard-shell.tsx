"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ClipboardList,
    CreditCard,
    Heart,
    LayoutDashboard,
    LogOut,
    Menu,
    Pizza,
    Settings,
    ShieldCheck,
    ShoppingBag,
    Store,
    UsersRound,
} from "lucide-react";
import { toast } from "sonner";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import { APP_ROUTES, getDashboardPath } from "@/constants/routes";
import { useAuth } from "@/features/auth/hooks";
import { signOut } from "@/features/auth/services/auth-service";
import type { UserRole } from "@/types/auth-types";

import { ThemeToggle } from "./theme-toggle";

interface NavItem {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    exact?: boolean;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
    admin: [
        {
            label: "Overview",
            href: APP_ROUTES.ADMIN.DASHBOARD,
            icon: LayoutDashboard,
            exact: true,
        },
        {
            label: "Manage Users",
            href: APP_ROUTES.ADMIN.USERS,
            icon: UsersRound,
        },
        {
            label: "Menu Items",
            href: APP_ROUTES.ADMIN.MENU_ITEMS,
            icon: Pizza,
        },
        {
            label: "Transactions",
            href: APP_ROUTES.ADMIN.TRANSACTIONS,
            icon: CreditCard,
        },
    ],
    vendor: [
        {
            label: "Overview",
            href: APP_ROUTES.VENDOR.DASHBOARD,
            icon: LayoutDashboard,
            exact: true,
        },
        {
            label: "My Menu Items",
            href: APP_ROUTES.VENDOR.MY_MENU_ITEMS,
            icon: Pizza,
        },
        {
            label: "Customer Orders",
            href: APP_ROUTES.VENDOR.ORDERS,
            icon: ClipboardList,
        },
        {
            label: "Subscription",
            href: APP_ROUTES.VENDOR.SUBSCRIPTION,
            icon: ShieldCheck,
        },
    ],
    customer: [
        {
            label: "Overview",
            href: APP_ROUTES.CUSTOMER.DASHBOARD,
            icon: LayoutDashboard,
            exact: true,
        },
        {
            label: "My Orders",
            href: APP_ROUTES.CUSTOMER.MY_ORDERS,
            icon: ShoppingBag,
        },
        {
            label: "Favorites",
            href: APP_ROUTES.CUSTOMER.FAVORITES,
            icon: Heart,
        },
    ],
};

function getRequiredRole(pathname: string): UserRole | null {
    if (pathname.startsWith("/dashboard/admin")) return "admin";
    if (pathname.startsWith("/dashboard/vendor")) return "vendor";
    if (pathname.startsWith("/dashboard/customer")) return "customer";
    return null;
}

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function DashboardSkeleton() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-3xl space-y-4 p-8">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
            </div>
        </div>
    );
}

export function DashboardShell({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const role = user?.role as UserRole | undefined;
    const navItems = role ? roleNavItems[role] : [];
    const requiredRole = getRequiredRole(pathname);

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.replace(
                `/sign-in?redirectTo=${encodeURIComponent(pathname)}`
            );
            return;
        }

        if (user.isBlocked) {
            void signOut().finally(() => {
                toast.error("Your account has been blocked.");
                router.replace(
                    `/sign-in?error=blocked&redirectTo=${encodeURIComponent(pathname)}`
                );
            });
            return;
        }

        if (requiredRole && role !== requiredRole) {
            router.replace(getDashboardPath(role));
            return;
        }

        if (pathname === "/dashboard" && role) {
            router.replace(getDashboardPath(role));
        }
    }, [isLoading, pathname, requiredRole, role, router, user]);

    if (isLoading || !user || !role || (requiredRole && role !== requiredRole)) {
        return <DashboardSkeleton />;
    }

    async function handleSignOut() {
        await signOut();
        toast.success("You have been signed out.");
        router.push("/");
        router.refresh();
    }

    function isActive(item: NavItem) {
        return item.exact ? pathname === item.href : pathname.startsWith(item.href);
    }

    const sidebarContent = (
        <div className="flex h-full flex-col">
            <Link href="/" className="flex h-18 shrink-0 items-center gap-2 px-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-red text-white">
                    <Pizza className="size-5" />
                </span>
                <span className="text-xl font-extrabold tracking-tight">
                    <span className="text-brand-red">Pizza</span>Hub
                </span>
            </Link>

            <div className="px-4 pb-3">
                <div className="rounded-xl border bg-muted/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {role} workspace
                    </p>
                    <p className="mt-1 truncate text-sm font-bold">{user.name}</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                isActive(item)
                                    ? "bg-brand-red text-white shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                        >
                            <Icon className="size-4.5 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="pt-3">
                    <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Account
                    </p>

                    <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            pathname === "/profile"
                                ? "bg-brand-red text-white"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                    >
                        <Settings className="size-4.5" />
                        Profile Settings
                    </Link>

                    <button
                        type="button"
                        onClick={() => void handleSignOut()}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                        <LogOut className="size-4.5" />
                        Logout
                    </button>
                </div>
            </nav>

            <div className="border-t p-4 text-xs text-muted-foreground">
                {role === "vendor" && (
                    <Link
                        href={APP_ROUTES.VENDOR.SUBSCRIPTION}
                        className="flex items-center gap-2 font-semibold text-brand-red hover:underline"
                    >
                        <Store className="size-4" />
                        Upgrade your plan
                    </Link>
                )}
                {role !== "vendor" && (
                    <Link href="/menu" className="hover:text-brand-red">
                        Browse the public menu
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/20">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-sidebar lg:block">
                {sidebarContent}
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
                    <div className="flex items-center gap-2">
                        <Sheet
                            open={isMobileMenuOpen}
                            onOpenChange={setIsMobileMenuOpen}
                        >
                            <SheetTrigger
                                render={<Button variant="ghost" size="icon" />}
                            >
                                <Menu className="size-5" />
                                <span className="sr-only">Open dashboard menu</span>
                            </SheetTrigger>

                            <SheetContent side="left" className="w-72 p-0">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Dashboard navigation</SheetTitle>
                                    <SheetDescription>
                                        Navigate your PizzaHub dashboard.
                                    </SheetDescription>
                                </SheetHeader>
                                {sidebarContent}
                            </SheetContent>
                        </Sheet>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-brand-red">
                                {role} dashboard
                            </p>
                            <p className="text-sm font-semibold">
                                Welcome back, {user.name.split(" ")[0]}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        <Avatar size="sm">
                            {user.image ? (
                                <AvatarImage src={user.image} alt={user.name} />
                            ) : null}
                            <AvatarFallback>{initials(user.name)}</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
