import Redis from 'ioredis';

const useRedis = process.env.REDIS_HOST && process.env.REDIS_HOST !== '';

let redisClient: any;

if (useRedis) {
  redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
    connectTimeout: 5000,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 50, 2000);
    } });
  
  // Attach error handler to prevent unhandled error event crash
  redisClient.on('error', (err: any) => {
    console.warn('Redis Connection Error:', err.message);
  });
} else {
  // Mock Redis
  redisClient = {
    set: async () => true,
    get: async () => null,
    del: async () => true,
    incr: async () => 1,
    expire: async () => true,
    sadd: async () => 1,
    sismember: async () => 0,
    keys: async () => [],
    on: () => {} };
}

export const redis = redisClient;

export async function setCache(key: string, data: any, ttlSeconds: number = 3600) {
  if (!useRedis) return true;
  try {
    const stringData = JSON.stringify(data);
    await redis.set(key, stringData, 'EX', ttlSeconds);
    return true;
  } catch (error) {
    console.error('Redis Set Error:', error);
    return false;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (!useRedis) return null;
  try {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Redis Get Error:', error);
    return null;
  }
}

export async function invalidateAdminPendaftarCache() {
  if (!useRedis) return true;
  try {
    const keys = await redis.keys('admin_pendaftar_list_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Redis Invalidate Error:', error);
  }
}

export default redis;
