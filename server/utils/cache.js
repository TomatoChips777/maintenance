// utils/cache.js

const cache = new Map();  // Using a Map to ensure insertion order is maintained

// Set cache with TTL (Time To Live) in seconds
const setCache = (key, data, ttl = 60) => {
  const expires = Date.now() + ttl * 1000;  // Expiry time in milliseconds
  cache.set(key, { data, expires });

  // Clean up old cache entries if the size exceeds a threshold (e.g., 100 items)
  if (cache.size > 100) {
    const oldestKey = cache.keys().next().value;  // Get the first inserted (oldest) key
    cache.delete(oldestKey);  // Remove the oldest cache entry to prevent memory overflow
  }
};

// Get cache by key, checks if the cache is expired
const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;  // No cache entry found

  // If cache has expired, remove it and return null
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }

  return entry.data;  // Return the cache data if valid
};

// Optional: Clear all cached data manually (e.g., during app restart)
const clearCache = () => {
  cache.clear();
};

module.exports = {
  setCache,
  getCache,
  clearCache,  // Export clearCache to allow clearing the cache manually
};
