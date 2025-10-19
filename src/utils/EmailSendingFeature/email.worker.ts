// src/utils/EmailSendingFeature/queues/email.worker.ts
import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import { emailQueue } from "./email.queue";
import sendGridBulkEmailSender from "../../helpars/emailSender/sendGridBulkEmailSender";
import prisma from "../../shared/prisma";
import { clearRecipientsCache } from "./email.cache";

const BATCH_SIZE = 100; // tune based on SendGrid rate limits

const worker = new Worker(
  "email-queue",
  async (job) => {
    if (job.name === "send-bulk") {
      const { recipients, subject, html } = job.data as {
        recipients: string[];
        subject: string;
        html: string;
      };

      // SendGrid bulk util expects an array of {subject, email, html}
      const messages = recipients.map((email) => ({
        subject,
        email,
        html,
      }));

      await sendGridBulkEmailSender(messages);

      // clear cache for this batch if cacheKey provided
      const cacheKey = job.data?.cacheKey as string | undefined;
      if (cacheKey) {
        try {
          await clearRecipientsCache(cacheKey);
        } catch (err) {
          console.warn("Failed to clear recipients cache", cacheKey, err);
        }
      }

      return { sent: recipients.length };
    }

    if (job.name === "send-all") {
      const { subject, html } = job.data as { subject: string; html: string };

      // Select only verified users (or add a 'newsletterOptIn' flag if you have it)
      const users = await prisma.user.findMany({
        where: { isVerified: true },
        select: { email: true },
      });

      const emails = users
        .map((u: { email: string | null }) => u.email)
        .filter(Boolean) as string[];

      // chunk and enqueue send-bulk jobs for parallelism
      for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const chunk = emails.slice(i, i + BATCH_SIZE);
        await emailQueue.add(
          "send-bulk",
          { recipients: chunk, subject, html },
          { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
        );
      }

      return { queuedBatches: Math.ceil(emails.length / BATCH_SIZE) };
    }

    // unknown job
    throw new Error(`Unknown job name ${job.name}`);
  },
  { connection: redisConnection, concurrency: 5 }
);

// optional: logging and failure hooks
worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} (${job?.name}) failed:`, err);
});

export default worker;
