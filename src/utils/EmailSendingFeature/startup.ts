import "dotenv/config";
import "./queues/email.worker"; // start worker
import { sendBulkEmails } from "./email.service";

export const initalizedEmail = () => {
  const emails = ["user1@test.com", "user2@test.com", "user3@test.com"];
  sendBulkEmails(emails, "Welcome!", "<h1>Hello!</h1>");
};
