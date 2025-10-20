// src/utils/EmailSendingFeature/scheduler.ts
import { emailQueue } from "./email.queue";

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
const ONE_MINUTE_MS = 60 * 1000;

export async function registerSendAllJob(subject: string, html: string) {
  // jobId prevents duplication on restart
  await emailQueue.add(
    "send-all",
    { subject, html },
    {
      jobId: "send-all", // ensures single repeatable job instance
      repeat: { every: ONE_MINUTE_MS },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
}
