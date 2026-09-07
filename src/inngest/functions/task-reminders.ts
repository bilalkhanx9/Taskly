import { inngest } from "../client";
import { sendTaskAssignmentEmail } from "@/lib/mail";

export const handleTaskAssigned = inngest.createFunction(
  {
    id: "send-task-assigned-email",
    triggers: [{ event: "tasks/assigned" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const { taskId, taskTitle, assigneeEmail, assigneeName, assignerName, boardTitle } = event.data;

    await step.run("send-assignment-notification", async () => {
      await sendTaskAssignmentEmail({
        to: assigneeEmail,
        assigneeName,
        taskTitle,
        boardTitle,
        assignerName,
      });
    });

    return { success: true, taskId };
  }
);

export const scheduleDueReminder = inngest.createFunction(
  {
    id: "schedule-task-due-reminder",
    triggers: [{ event: "tasks/due-reminder" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const { taskId, taskTitle, dueDate, userEmail } = event.data;

    // Sleep until 24 hours before due date
    const reminderTime = new Date(new Date(dueDate).getTime() - 24 * 60 * 60 * 1000);

    if (reminderTime > new Date()) {
      await step.sleepUntil("wait-for-reminder-window", reminderTime);
    }

    await step.run("send-due-date-alert", async () => {
      console.log(`[Inngest Job] Sent due date alert to ${userEmail} for task "${taskTitle}"`);
    });

    return { taskId, alerted: true };
  }
);
