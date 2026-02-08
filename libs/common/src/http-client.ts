import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import CircuitBreaker from 'opossum';
import { signInternalJwt } from './jwt';

export function buildInternalHttpClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    timeout: 2000,
    headers: {
      'content-type': 'application/json',
    },
  });

  axiosRetry(client, {
    retries: 2,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (err) =>
      axiosRetry.isNetworkOrIdempotentRequestError(err) ||
      (err.response?.status ?? 0) >= 500,
  });

  client.interceptors.request.use((config) => {
    config.headers = config.headers ?? {};
    config.headers['authorization'] = `Bearer ${signInternalJwt()}`;
    return config;
  });

  // circuit breaker wraps request execution
  const breaker = new CircuitBreaker(
    async (cfg: { method: 'get' | 'post'; url: string; data?: unknown }) => {
      if (cfg.method === 'get') return client.get(cfg.url);
      return client.post(cfg.url, cfg.data);
    },
    {
      timeout: 2500,
      errorThresholdPercentage: 50,
      resetTimeout: 10000,
    }
  );

  return {
    get: async <T>(url: string): Promise<T> => {
      const res = await breaker.fire({ method: 'get', url });
      return res.data as T;
    },
    post: async <T>(url: string, data: unknown): Promise<T> => {
      const res = await breaker.fire({ method: 'post', url, data });
      return res.data as T;
    },
  };
}
