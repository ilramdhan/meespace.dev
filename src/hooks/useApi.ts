import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for fetching data from API
 */
export function useFetch<T>(url: string, options?: { enabled?: boolean }): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const enabled = options?.enabled !== false;

    const fetchData = useCallback(async () => {
        if (!enabled) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(url);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch data');
            }

            setData(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [url, enabled]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}

interface MutationState {
    isLoading: boolean;
    error: string | null;
}

interface MutationOptions<TData> {
    onSuccess?: (data: TData) => void;
    onError?: (error: string) => void;
}

type MutateFunction<TInput, TData> = (input: TInput) => Promise<TData | null>;

/**
 * Hook for mutating data (POST, PUT, DELETE)
 */
export function useMutation<TInput = unknown, TData = unknown>(
    url: string,
    method: 'POST' | 'PUT' | 'DELETE' = 'POST',
    options?: MutationOptions<TData>
): [MutateFunction<TInput, TData>, MutationState] {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = useCallback(async (input: TInput): Promise<TData | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: method !== 'DELETE' ? JSON.stringify(input) : undefined,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Operation failed');
            }

            options?.onSuccess?.(result.data);
            return result.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            options?.onError?.(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [url, method, options]);

    return [mutate, { isLoading, error }];
}

/**
 * Helper function for API calls with full URL support
 */
export async function apiCall<T>(
    endpoint: string,
    options?: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        body?: unknown;
        params?: Record<string, string>;
    }
): Promise<{ success: boolean; data?: T; error?: string }> {
    const { method = 'GET', body, params } = options || {};

    let url = endpoint;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    try {
        const response = await fetch(url, {
            method,
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
            body: body ? JSON.stringify(body) : undefined,
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.error || 'Request failed' };
        }

        return { success: true, data: result.data };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Network error',
        };
    }
}
