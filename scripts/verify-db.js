const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const workspaces = await prisma.workspace.count();
  const projects = await prisma.project.count();
  const tasks = await prisma.task.count();
  const subtasks = await prisma.subtask.count();
  const comments = await prisma.taskComment.count();
  const logs = await prisma.activityLog.count();

  console.log("=== TASKLY DATABASE STATUS ===");
  console.log(`Users: ${users}`);
  console.log(`Workspaces: ${workspaces}`);
  console.log(`Projects: ${projects}`);
  console.log(`Tasks: ${tasks}`);
  console.log(`Subtasks (1-level checklist): ${subtasks}`);
  console.log(`Comments: ${comments}`);
  console.log(`Activity Logs: ${logs}`);
  console.log("===============================");

  await prisma.$disconnect();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
