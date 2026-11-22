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

function isActive(item: NavItem, pathname: string) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function DashboardSkeleton() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-3xl space-y-4 p-6 sm:p-8">
                <Skeleton className="h-10 w-48 sm:w-64" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
            </div>
        </div>
    );
}

interface SidebarContentProps {
    role: UserRole;
    userName: string;
    navItems: NavItem[];
    pathname: string;
    compact?: boolean;
    onNavigate: () => void;
    onSignOut: () => void;
}

function SidebarContent({
    role,
    userName,
    navItems,
    pathname,
    compact = false,
    onNavigate,
    onSignOut,
}: SidebarContentProps) {
    const linkBase = compact
        ? "flex h-11 w-full items-center justify-center rounded-xl transition-colors"
        : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";

    return (
        <div className="flex h-full flex-col">
            <Link
                href="/"
                onClick={onNavigate}
                title={compact ? "PizzaHub home" : undefined}
                className={`flex h-16 shrink-0 items-center gap-2 lg:h-18 ${
                    compact ? "justify-center px-2" : "px-4 sm:px-6"
                }`}
            >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-red text-white">
                    <Pizza className="size-5" />
                </span>
                {!compact && (
                    <span className="truncate text-xl font-extrabold tracking-tight">
                        <span className="text-brand-red">Pizza</span>Hub
                    </span>
                )}
            </Link>

            {!compact && (
                <div className="px-3 pb-3 sm:px-4">
                    <div className="rounded-xl border bg-muted/40 p-3">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
                            {role} workspace
                        </p>
                        <p className="mt-1 truncate text-sm font-bold">
                            {userName}
                        </p>
                    </div>
                </div>
            )}

            <nav
                aria-label="Dashboard"
                className={`flex-1 space-y-1 overflow-y-auto pb-4 ${
                    compact ? "px-2.5" : "px-3 sm:px-4"
                }`}
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item, pathname);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            title={compact ? item.label : undefined}
                            aria-current={active ? "page" : undefined}
                            className={`${linkBase} ${
                                active
                                    ? "bg-brand-red text-white shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                        >
                            <Icon className="size-[1.15rem] shrink-0" />
                            {compact ? (
                                <span className="sr-only">{item.label}</span>
                            ) : (
                                item.label
                            )}
                        </Link>
                    );
                })}

                {compact ? (
                    <div className="mt-3 space-y-1 border-t pt-3">
                        <Link
                            href="/profile"
                            onClick={onNavigate}
                            title="Profile Settings"
                            aria-current={
                                pathname === "/profile" ? "page" : undefined
                            }
                            className={`${linkBase} ${
                                pathname === "/profile"
                                    ? "bg-brand-red text-white"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                        >
                            <Settings className="size-[1.15rem]" />
                            <span className="sr-only">Profile Settings</span>
                        </Link>

                        <button
                            type="button"
                            onClick={onSignOut}
                            title="Logout"
                            className={`${linkBase} text-muted-foreground hover:bg-destructive/10 hover:text-destructive`}
                        >
                            <LogOut className="size-[1.15rem]" />
                            <span className="sr-only">Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="pt-3">
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Account
                        </p>

                        <Link
                            href="/profile"
                            onClick={onNavigate}
                            aria-current={
                                pathname === "/profile" ? "page" : undefined
                            }
                            className={`${linkBase} ${
                                pathname === "/profile"
                                    ? "bg-brand-red text-white"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                        >
                            <Settings className="size-[1.15rem]" />
                            Profile Settings
                        </Link>

                        <button
                            type="button"
                            onClick={onSignOut}
                            className={`${linkBase} w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive`}
                        >
                            <LogOut className="size-[1.15rem]" />
                            Logout
                        </button>
                    </div>
                )}
            </nav>

            {!compact && (
                <div className="border-t p-3 text-xs text-muted-foreground sm:p-4">
                    {role === "vendor" ? (
                        <Link
                            href={APP_ROUTES.VENDOR.SUBSCRIPTION}
                            onClick={onNavigate}
                            className="flex items-center gap-2 font-semibold text-brand-red hover:underline"
                        >
                            <Store className="size-4" />
                            Upgrade your plan
                        </Link>
                    ) : (
                        <Link
                            href="/menu"
                            onClick={onNavigate}
                            className="hover:text-brand-red"
                        >
                            Browse the public menu
                        </Link>
                    )}
                </div>
            )}
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
        setIsMobileMenuOpen(false);
        await signOut();
        toast.success("You have been signed out.");
        router.push("/");
        router.refresh();
    }

    function handleNavigate() {
        setIsMobileMenuOpen(false);
    }

    const sidebarProps = {
        role,
        userName: user.name,
        navItems,
        pathname,
        onNavigate: handleNavigate,
        onSignOut: () => void handleSignOut(),
    };

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Full sidebar: desktop */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-sidebar lg:block">
                <SidebarContent {...sidebarProps} />
            </aside>

            {/* Icon rail: tablet */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-20 flex-col border-r bg-sidebar md:flex lg:hidden">
                <SidebarContent {...sidebarProps} compact />
            </aside>

            <div className="md:pl-20 lg:pl-64">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b bg-background/95 px-3 backdrop-blur sm:gap-3 sm:px-5 lg:h-18 lg:px-6">
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                        <Sheet
                            open={isMobileMenuOpen}
                            onOpenChange={setIsMobileMenuOpen}
                        >
                            <SheetTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 md:hidden"
                                    />
                                }
                            >
                                <Menu className="size-5" />
                                <span className="sr-only">
                                    Open dashboard menu
                                </span>
                            </SheetTrigger>

                            <SheetContent
                                side="left"
                                className="w-72 max-w-[85vw] p-0"
                            >
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Dashboard navigation</SheetTitle>
                                    <SheetDescription>
                                        Navigate your PizzaHub dashboard.
                                    </SheetDescription>
                                </SheetHeader>
                                <SidebarContent {...sidebarProps} />
                            </SheetContent>
                        </Sheet>

                        <div className="min-w-0">
                            <p className="truncate text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-brand-red sm:text-xs sm:tracking-widest">
                                {role} dashboard
                            </p>
                            <p className="truncate text-sm font-semibold">
                                Welcome back, {user.name.split(" ")[0]}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                        <ThemeToggle />

                        <Link
                            href="/profile"
                            aria-label="Open profile settings"
                            className="rounded-full ring-offset-background outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <Avatar size="sm">
                                {user.image ? (
                                    <AvatarImage
                                        src={user.image}
                                        alt={user.name}
                                    />
                                ) : null}
                                <AvatarFallback>
                                    {initials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
