"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Pizza, UserRound } from "lucide-react";
import { toast } from "sonner";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { PUBLIC_NAV_LINKS } from "@/constants/site";
import { getDashboardPath } from "@/constants/routes";
import { useAuth } from "@/features/auth/hooks";
import { signOut } from "@/features/auth/services/auth-service";
import { ThemeToggle } from "./theme-toggle";

function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function SiteHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const dashboardHref = user ? getDashboardPath(user.role) : "/";

    async function handleSignOut() {
        try {
            await signOut();
            toast.success("You have been signed out.");
            router.push("/");
            router.refresh();
        } catch {
            toast.error("Unable to sign out. Please try again.");
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex shrink-0 items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red text-white">
                        <Pizza className="h-6 w-6" />
                    </span>

                    <span className="text-2xl font-extrabold tracking-tight">
                        <span className="text-brand-red">Pizza</span>
                        <span>Hub</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {PUBLIC_NAV_LINKS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm font-medium transition-colors hover:text-brand-red ${
                                pathname === item.href
                                    ? "text-brand-red"
                                    : "text-muted-foreground"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {isAuthenticated && (
                        <Link
                            href={dashboardHref}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand-red"
                        >
                            Dashboard
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none ring-brand-red/40 focus-visible:ring-2">
                                <Avatar size="sm">
                                    {user.image ? (
                                        <AvatarImage
                                            src={user.image}
                                            alt={user.name}
                                        />
                                    ) : null}
                                    <AvatarFallback>
                                        {initials(user.name || "PizzaHub User")}
                                    </AvatarFallback>
                                </Avatar>

                                <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">
                                    {user.name}
                                </span>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <span className="block truncate">
                                        {user.name}
                                    </span>
                                    <span className="block truncate text-xs font-normal text-muted-foreground">
                                        {user.email}
                                    </span>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onSelect={() => router.push(dashboardHref)}
                                >
                                    <Pizza />
                                    Dashboard
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onSelect={() => router.push("/profile")}
                                >
                                    <UserRound />
                                    Profile Settings
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    variant="destructive"
                                    onSelect={() => void handleSignOut()}
                                >
                                    <LogOut />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                className="hidden rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent sm:block"
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/sign-up"
                                className="hidden rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-red/90 sm:block"
                            >
                                Get Started
                            </Link>
                        </>
                    )}

                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger render={<Button variant="ghost" size="icon" />}>
                            <Menu className="size-5" />
                            <span className="sr-only">Open navigation menu</span>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-72">
                            <SheetHeader>
                                <SheetTitle>PizzaHub</SheetTitle>
                                <SheetDescription>
                                    Explore pizzas and manage your account.
                                </SheetDescription>
                            </SheetHeader>

                            <nav className="flex flex-col gap-1 px-4">
                                {PUBLIC_NAV_LINKS.map((item) => (
                                    <Button
                                        key={item.href}
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={() => {
                                            router.push(item.href);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}

                                {isAuthenticated && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => {
                                                router.push(dashboardHref);
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            Dashboard
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => {
                                                router.push("/profile");
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            Profile Settings
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            className="justify-start text-destructive"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                void handleSignOut();
                                            }}
                                        >
                                            Logout
                                        </Button>
                                    </>
                                )}

                                {!isAuthenticated && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => {
                                                router.push("/sign-in");
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            Sign In
                                        </Button>

                                        <Button
                                            className="justify-start"
                                            onClick={() => {
                                                router.push("/sign-up");
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            Get Started
                                        </Button>
                                    </>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
