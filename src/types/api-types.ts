
export type ApiResponse<
    T extends object = Record<string, never>
> = {
    success: boolean;
    message: string;
} & T;

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    limit: number;
}

export type PaginatedApiResponse<
    T,
    K extends string
> = ApiResponse<
    {
        pagination: PaginationMeta;
    } & Record<K, T[]>
>;
