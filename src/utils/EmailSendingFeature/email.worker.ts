import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis";
import emailSender from "../../helpars/emailSender/emailSender";

const CHUNK_SIZE = 50; // send 50 emails per batch

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { recipients, subject, html } = job.data;

    // Split emails into chunks
    const chunks = [];
    for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
      chunks.push(recipients.slice(i, i + CHUNK_SIZE));
    }

    for (const chunk of chunks) {
      const sendPromises = chunk.map((email: string) =>
        emailSender("subject ...", email, "HTML Content")
      );

      await Promise.all(sendPromises);
      console.log(`✅ Sent batch of ${chunk.length} emails`);
      await new Promise((r) => setTimeout(r, 2000)); // smooth delay between batches
    }
  },
  { connection: redisConnection }
);
