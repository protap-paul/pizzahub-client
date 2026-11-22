
export const SITE_CONFIG = {
    name: "PizzaHub",
    description: "Delicious Pizza, Delivered Fresh",
    tagline: "Your favorite pizza, just a click away.",
    currency: "BDT",
} as const;

export const PUBLIC_NAV_LINKS = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Browse Menu",
        href: "/menu",
    },
] as const;

export const AUTH_NAV_LINKS = [
    {
        label: "Sign In",
        href: "/sign-in",
    },
    {
        label: "Sign Up",
        href: "/sign-up",
    },
] as const;
