// somewhere on server startup
import "./email.worker"; // ensure worker process is started (if running worker in same process)
import { registerSendAllJob } from "./scheduler";

export const emailStartupService = () => {
  registerSendAllJob(
    "Weekly project update", // example subject; set dynamically or load from DB/config
    "<p>Your HTML body here</p>"
  );
};
