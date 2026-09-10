require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const [users, skills, projects, mentors, demandes, opportunities, messages] =
    await Promise.all([
      prisma.user.count(),
      prisma.skill.count(),
      prisma.project.count(),
      prisma.mentorProfile.count(),
      prisma.mentorshipRequest.count(),
      prisma.opportunity.count(),
      prisma.message.count(),
    ]);

  const comptes = await prisma.user.findMany({
    where: { email: { not: "catalogue@skillbridge.local" } },
    select: { nom: true, email: true, role: true, identifiantSkillbridge: true },
    orderBy: { role: "asc" },
  });

  console.log(`Base : ${process.env.DATABASE_URL ? "DATABASE_URL défini" : "DATABASE_URL manquant"}\n`);
  console.log("Tables");
  console.log(`  users                 ${users}`);
  console.log(`  skills                ${skills}`);
  console.log(`  projects              ${projects}`);
  console.log(`  mentor_profiles       ${mentors}`);
  console.log(`  mentorship_requests   ${demandes}`);
  console.log(`  opportunities         ${opportunities}`);
  console.log(`  messages              ${messages}`);
  console.log("\nComptes (hors catalogue)");
  for (const u of comptes) {
    console.log(`  [${u.role}] ${u.nom}  ${u.email}  /passport/${u.identifiantSkillbridge}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
