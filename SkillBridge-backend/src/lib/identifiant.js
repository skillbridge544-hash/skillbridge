/**
 * Génère un identifiant SkillBridge unique à partir du nom
 * (ex. "Aminata Diallo" → "aminata-diallo-k3x9").
 */
function slugify(nom) {
  return String(nom)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30) || "user";
}

function suffixeAleatoire() {
  return Math.random().toString(36).slice(2, 6);
}

async function genererIdentifiant(prisma, nom) {
  const base = slugify(nom);
  for (let i = 0; i < 8; i += 1) {
    const candidat = `${base}-${suffixeAleatoire()}`;
    const existant = await prisma.user.findUnique({
      where: { identifiantSkillbridge: candidat },
    });
    if (!existant) return candidat;
  }
  return `${base}-${Date.now().toString(36)}`;
}

module.exports = { slugify, genererIdentifiant };
