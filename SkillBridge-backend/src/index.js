require("dotenv").config();
const app = require("./app");
const prisma = require("./lib/prisma");

const PORT = process.env.PORT || 4000;

async function demarrer() {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET manquant dans .env");
    process.exit(1);
  }

  await prisma.$connect();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillBridge API prête sur le port ${PORT}`);
  });
}

demarrer().catch((err) => {
  console.error("Impossible de démarrer l'API :", err);
  process.exit(1);
});
