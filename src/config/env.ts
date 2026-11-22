
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error(
        "NEXT_PUBLIC_API_URL is missing. Please check your .env.local file."
    );
}

export const ENV = {
    API_URL: apiUrl,
} as const;
