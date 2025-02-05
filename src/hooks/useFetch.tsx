"use client";

import { useEffect, useState } from 'react';

interface FetchOptions {
    method?: string; // GET, POST, PUT, DELETE, etc.
    headers?: Record<string, string>;
    body?: any; // JSON.stringify(data)
}

interface FetchResponse<T> {
    success: boolean;
    data: T;
}

export default function useFetch<T>(
    url: string,
    options?: FetchOptions,
    bearerToken?: string
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestOptions: FetchOptions = {
                    method: options?.method || 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(bearerToken ? { 'Authorization': `Bearer ${bearerToken}` } : {}),
                        ...(options?.headers || {}),
                    },
                    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
                };

                const response = await fetch(url, requestOptions);

                console.log(response)
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const result: FetchResponse<T> = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    console.log(result)
                    throw new Error('API response indicates failure.');
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, options, bearerToken]);

    return { data, loading, error };
}