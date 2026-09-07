import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "Kanban App <onboarding@resend.dev>";

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface SendTaskAssignmentEmailProps {
  to: string;
  assigneeName: string;
  taskTitle: string;
  boardTitle: string;
  assignerName: string;
}

export async function sendTaskAssignmentEmail({
  to,
  assigneeName,
  taskTitle,
  boardTitle,
  assignerName,
}: SendTaskAssignmentEmailProps) {
  if (!resend) {
    console.log(`[Resend Mock Email] To: ${to} | Task Assigned: "${taskTitle}" by ${assignerName}`);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: `New Task Assigned: ${taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #4f46e5;">New Task Assigned</h2>
          <p>Hi <strong>${assigneeName}</strong>,</p>
          <p><strong>${assignerName}</strong> assigned you to a task in <strong>${boardTitle}</strong>:</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 12px; margin: 16px 0;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #1e293b;">${taskTitle}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">Open your Kanban board to view details, add comments, or upload attachments.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    return { success: false, error };
  }
}
