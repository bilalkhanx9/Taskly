import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { handleTaskAssigned, scheduleDueReminder } from "@/inngest/functions/task-reminders";
import { sendWeeklyDigest } from "@/inngest/functions/weekly-digest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [handleTaskAssigned, scheduleDueReminder, sendWeeklyDigest],
});
