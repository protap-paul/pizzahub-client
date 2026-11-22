import type { Metadata } from "next";

import { AuthGuard } from "@/features/auth/components";
import { ProfileSettingsForm } from "@/features/profile/components";

export const metadata: Metadata = {
    title: "Profile Settings",
    description: "Update your PizzaHub account information.",
};

export default function ProfilePage() {
    return (
        <AuthGuard>
            <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <ProfileSettingsForm />
            </main>
        </AuthGuard>
    );
}
