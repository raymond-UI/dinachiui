import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const CACHE_TTL = 60 * 60 * 24 * 7; // 7 days
const KEY_PREFIX = "gen:";

async function hashPrompt(prompt: string): Promise<string> {
  const data = new TextEncoder().encode(prompt);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getCachedResponse(prompt: string): Promise<string | null> {
  const key = KEY_PREFIX + (await hashPrompt(prompt));
  return redis.get<string>(key);
}

export async function cacheResponse(prompt: string, jsonl: string): Promise<void> {
  const key = KEY_PREFIX + (await hashPrompt(prompt));
  await redis.set(key, jsonl, { ex: CACHE_TTL });
}
