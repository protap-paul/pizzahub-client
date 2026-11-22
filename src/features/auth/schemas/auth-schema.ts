
import { z } from "zod";

function isValidImageUrl(value: string) {
    try {
        const url = new URL(value);

        return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
    } catch {
        return false;
    }
}

export const signUpSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters.")
            .max(50, "Name cannot exceed 50 characters."),

        email: z
            .string()
            .trim()
            .email("Please enter a valid email address."),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters.")
            .max(128, "Password cannot exceed 128 characters.")
            .regex(/[a-z]/, "Password must contain a lowercase letter.")
            .regex(/[A-Z]/, "Password must contain an uppercase letter."),

        role: z.enum(["customer", "vendor"]),

        businessName: z.string().trim().optional(),

        image: z
            .string()
            .trim()
            .refine((value) => value === "" || isValidImageUrl(value), {
                message: "Please enter a valid image URL.",
            })
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.role === "vendor") {
            if (!data.businessName || data.businessName.length < 2) {
                ctx.addIssue({
                    code: "custom",
                    path: ["businessName"],
                    message: "Business name must be at least 2 characters.",
                });
            }

            if (data.businessName && data.businessName.length > 80) {
                ctx.addIssue({
                    code: "custom",
                    path: ["businessName"],
                    message: "Business name cannot exceed 80 characters.",
                });
            }
        }
    });

export const signInSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(1, "Password is required."),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
