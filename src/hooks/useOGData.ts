import { useState, useEffect } from 'react';

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: string;
  favicon?: string;
}

interface UseOGDataResult {
  data: OGData | null;
  loading: boolean;
  error: string | null;
}

export function useOGData(url: string | null): UseOGDataResult {
  const [data, setData] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setError('Invalid URL format');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchOGData = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(`/api/og-data?url=${encodeURIComponent(url)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          let errorMessage;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || 'Failed to fetch OG data';
          } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const ogData = await response.json();
        setData(ogData);
      } catch (err) {
        clearTimeout(timeoutId);
        
        if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
          setError('Request timeout - please try again');
        } else {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the request
    const timeoutId = setTimeout(fetchOGData, 500);

    return () => clearTimeout(timeoutId);
  }, [url]);

  return { data, loading, error };
}