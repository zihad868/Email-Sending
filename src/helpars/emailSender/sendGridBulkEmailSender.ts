import sgMail from "@sendgrid/mail";
import config from "../../config";

// Validate SendGrid API key early so errors are clear at startup
if (!config.sendGrid.api_key || !(config.sendGrid.api_key as string).startsWith("SG.")) {
  console.error('SendGrid API key missing or invalid. Ensure SENDGRID_API_KEY starts with "SG." in your .env');
  // don't throw here to allow fallback to nodemailer if you want, but log clearly
} else {
  sgMail.setApiKey(config.sendGrid.api_key as string);
}

const sendGridBulkEmailSender = async (
  emails: { subject: string; email: string; html: string }[]
) => {
  const messages = emails.map(({ subject, email, html }) => ({
    to: email,
    from: config.sendGrid.email_from as string,
    subject: subject,
    html: html,
  }));

  try {
    // Send all emails using an array of messages
    const response = await sgMail.send(messages);
    // console.log("Bulk emails sent successfully.");
    return response;
  } catch (error: any) {
    console.error("Error sending bulk emails:", error?.response?.body || error);
    throw error;
  }
};

export default sendGridBulkEmailSender;
