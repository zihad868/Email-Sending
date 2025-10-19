import { emailQueue } from "./email.queue";
import { setRecipientsCache } from "./email.cache";

export const sendBulkEmails = async (
  recipients: string[],
  subject: string,
  html: string
) => {
  // create a cache key for this batch so worker can clear it after successful send
  const cacheKey = `email:batch:${Date.now()}`;
  await setRecipientsCache(cacheKey, recipients);

  await emailQueue.add("send-bulk", { recipients, subject, html, cacheKey });
};
