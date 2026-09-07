import { inngest } from "../client";
import { prisma } from "@/lib/prisma";

export const sendWeeklyDigest = inngest.createFunction(
  {
    id: "send-weekly-digest-cron",
    triggers: [{ cron: "0 9 * * MON" }],
  },
  async ({ step }: { step: any }) => {
    const workspaces = await step.run("fetch-active-workspaces", async () => {
      try {
        return await prisma.workspace.findMany({
          select: { id: true, name: true },
          take: 50,
        });
      } catch (err) {
        return [];
      }
    });

    for (const workspace of workspaces) {
      await step.run(`process-digest-${workspace.id}`, async () => {
        console.log(`[Inngest Cron] Processing weekly digest for workspace: ${workspace.name}`);
      });
    }

    return { processedWorkspaces: workspaces.length };
  }
);
