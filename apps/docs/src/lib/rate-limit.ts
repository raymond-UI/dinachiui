import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Two-tier rate limiting: both must pass
const perMinute = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "rl:min",
});

const perDay = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "1 d"),
  prefix: "rl:day",
});

export async function checkRateLimit(ip: string) {
  const [minute, day] = await Promise.all([
    perMinute.limit(ip),
    perDay.limit(ip),
  ]);

  if (!minute.success) {
    return {
      success: false as const,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((minute.reset - Date.now()) / 1000)),
      message: "Too many requests. Please wait a moment and try again.",
    };
  }

  if (!day.success) {
    return {
      success: false as const,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((day.reset - Date.now()) / 1000)),
      message: "Daily request limit reached. Please try again tomorrow.",
    };
  }

  return {
    success: true as const,
    remaining: Math.min(minute.remaining, day.remaining),
    retryAfter: 0,
    message: "",
  };
}
