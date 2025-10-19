import { redisConnection } from "../../config/redis";

export const setRecipientsCache = async (key: string, recipients: string[]) => {
  await redisConnection.set(key, JSON.stringify(recipients));
};

export const getRecipientsCache = async (key: string) => {
  const raw = await redisConnection.get(key);
  if (!raw) return [] as string[];
  try {
    return JSON.parse(raw) as string[];
  } catch (err) {
    return [] as string[];
  }
};

export const clearRecipientsCache = async (key: string) => {
  if (!key) return;
  await redisConnection.del(key);
};

export default {
  setRecipientsCache,
  getRecipientsCache,
  clearRecipientsCache,
};
