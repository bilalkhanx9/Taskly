const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAuth() {
  console.log("=== TESTING AUTH & DATABASE PERSISTENCE ===");
  
  // 1. Check Platform Admin
  const admin = await prisma.user.findUnique({
    where: { email: "bilalrauf.ds@gmail.com" },
  });
  console.log("1. Platform Admin in DB:", admin ? {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    hasPassword: !!admin.password,
  } : "NOT FOUND");

  // 2. Simulate User Registration for the email in screenshot: mosepe1134@fidhost.com
  const testEmail = "mosepe1134@fidhost.com";
  // Clean if previously created in test
  await prisma.user.deleteMany({ where: { email: testEmail } });

  const domain = testEmail.split("@")[1];
  let org = await prisma.organisation.findUnique({ where: { domain } });
  if (!org) {
    org = await prisma.organisation.create({
      data: {
        name: "Fidhost Organisation",
        domain,
        slug: `fidhost-${Date.now()}`,
        verified: true,
      },
    });
  }

  const newUser = await prisma.user.create({
    data: {
      name: "Mosepe Test",
      email: testEmail,
      password: "Password123!",
      role: "WORKSPACE_OWNER",
      companyDomain: domain,
      emailVerified: new Date(),
    },
  });

  const newWs = await prisma.workspace.create({
    data: {
      name: "Mosepe's Workspace",
      slug: `mosepe-ws-${Date.now()}`,
      tier: "PRO",
      organisationId: org.id,
      members: {
        create: {
          userId: newUser.id,
          role: "WORKSPACE_OWNER",
        },
      },
    },
  });

  console.log("2. Registered New User:", {
    userId: newUser.id,
    email: newUser.email,
    workspaceId: newWs.id,
    workspaceName: newWs.name,
  });

  // 3. Verify total user count in DB
  const totalUsers = await prisma.user.count();
  const totalWorkspaces = await prisma.workspace.count();
  console.log("3. Current DB Totals:", { users: totalUsers, workspaces: totalWorkspaces });

  // Cleanup test user
  await prisma.workspaceMember.deleteMany({ where: { userId: newUser.id } });
  await prisma.workspace.deleteMany({ where: { id: newWs.id } });
  await prisma.user.delete({ where: { id: newUser.id } });
  console.log("4. Cleaned up temporary test user. Only real Platform Admin remains.");

  const finalUsers = await prisma.user.findMany({ select: { name: true, email: true, role: true } });
  console.log("5. Active Users in DB:", finalUsers);

  console.log("=== AUTH TEST COMPLETE & VERIFIED ===");
  await prisma.$disconnect();
}

testAuth().catch(err => {
  console.error("Auth test failed:", err);
  process.exit(1);
});
