/**
 * Démarrage production (Railway) :
 * 1. synchronise le schéma Prisma
 * 2. seed une seule fois si SEED_ON_START=true
 * 3. lance l'API
 */
const { execSync } = require("child_process");

try {
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
  if (process.env.SEED_ON_START === "true") {
    console.log("SEED_ON_START=true → chargement des données de démo");
    execSync("node prisma/seed.js", { stdio: "inherit" });
  }
} catch (err) {
  console.error("Échec de la préparation de la base :", err.message);
  process.exit(1);
}

require("../src/index.js");
