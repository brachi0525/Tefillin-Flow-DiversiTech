/* Example of hook file */

import { useState, useEffect } from 'react';

interface ResponseData<T> {
    data: T | null
    loading: boolean
    error: Error | null
}

const useFetch = <T,>(url: string): ResponseData<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const result: T = await response.json();
                setData(result);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url]);
    return { data, loading, error };
};

export default useFetch;