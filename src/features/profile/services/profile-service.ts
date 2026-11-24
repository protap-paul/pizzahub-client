
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type {
    User,
    UpdateProfileInput,
} from "@/types/user-types";

export interface ProfileResponse {
    success: boolean;
    message: string;
    user: User;
}

export interface UpdateProfileResponse {
    success: boolean;
    message: string;
    updatedFields: UpdateProfileInput;
}

// Get the logged-in user's profile
export async function getMyProfile(cacheTtl?: number): Promise<ProfileResponse> {
    return apiRequest<ProfileResponse>(
        `${API_ENDPOINTS.USERS}/me`,
        { auth: true, cacheTtl }
    );
}

// Update the logged-in user's profile
export async function updateMyProfile(
    data: UpdateProfileInput
): Promise<UpdateProfileResponse> {
    return apiRequest<UpdateProfileResponse>(
        `${API_ENDPOINTS.USERS}/me`,
        {
            method: "PATCH",
            auth: true,
            body: JSON.stringify(data),
        }
    );
}
