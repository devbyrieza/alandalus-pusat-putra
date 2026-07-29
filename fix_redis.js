const fs = require('fs');
const path = 'C:/Users/itpua/Dev/Work/al-andalus/andalus-pusat-putra/src/lib/redis.ts';
let code = fs.readFileSync(path, 'utf8');

// Membuang new Redis() yang asli
const newCode = `
// MOCKED REDIS UNTUK VERCEL DEMO (Anti Crash)
export const redis = {
  set: async () => true,
  get: async () => null,
  del: async () => true,
  incr: async () => 1,
  expire: async () => true,
  sadd: async () => 1,
  sismember: async () => 0,
};

// Helper to safely stringify and set JSON data
export async function setCache(key: string, data: any, ttlSeconds: number = 3600) {
  return true;
}

export async function getCache<T>(key: string): Promise<T | null> {
  return null;
}
`;

fs.writeFileSync(path, newCode);
console.log('Redis berhasil di-mock untuk Vercel!');
