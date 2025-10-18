import { emailQueue } from "./email.queue";

export const sendBulkEmails = async (
  recipients: string[],
  subject: string,
  html: string
) => {
  await emailQueue.add("send-bulk", { recipients, subject, html });
};
