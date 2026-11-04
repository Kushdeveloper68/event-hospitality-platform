import axios from "axios";
import { createCachedAdapter, clearApiCache } from "./requestCache";
 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Short-lived cache for GET requests so switching tabs doesn't refetch everything.
// ttl: 0 = never cached. Any write (POST/PUT/PATCH/DELETE) clears the whole cache.
const CACHE_RULES = [
  { match: /\/(users|password-reset)(\/|\?|$)/, ttl: 0 }, // auth / account
  { match: /\/checkin(\/|\?|$)/, ttl: 0 },                // live check-in desk: several staff at once
  { match: /\/export(\/|\?|$)/, ttl: 0 },                 // downloads
  { match: /\/activity-logs/, ttl: 10_000 },               // changes constantly
  { match: /\/overview\//, ttl: 15_000 },                  // live counts on the Overview tab
];
api.defaults.adapter = createCachedAdapter(axios.getAdapter(api.defaults.adapter), {
  rules: CACHE_RULES,
  defaultTtl: 30_000,
});

/** 
 * Request Interceptor
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized");
      clearApiCache(); // never keep one session's data around after it expires
    }

    return Promise.reject(error);
  }
);

export default api;