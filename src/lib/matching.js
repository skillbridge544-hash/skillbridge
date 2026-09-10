/**
 * Normalise un nom de compétence pour la comparaison
 * (casse, accents, espaces).
 */
function normaliserCompetence(nom) {
  return String(nom || "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLowerCase();
}

/**
 * score = (compétences communes / compétences requises) × 100
 * Toujours renvoyer correspondances + manquantes (principe produit).
 */
function calculerMatching(competencesProfil, competencesRequises) {
  const profil = (competencesProfil || [])
    .map((c) => (typeof c === "string" ? c : c.nomCompetence || c.nom_competence))
    .filter(Boolean);

  const requises = (competencesRequises || [])
    .map((c) => (typeof c === "string" ? c : c.nomCompetence || c.nom_competence))
    .filter(Boolean);

  if (requises.length === 0) {
    return { score: 0, correspondances: [], manquantes: [] };
  }

  const setProfil = new Set(profil.map(normaliserCompetence));
  const correspondances = [];
  const manquantes = [];

  for (const nom of requises) {
    if (setProfil.has(normaliserCompetence(nom))) {
      correspondances.push(nom);
    } else {
      manquantes.push(nom);
    }
  }

  const score = Math.round((correspondances.length / requises.length) * 100);
  return { score, correspondances, manquantes };
}

module.exports = { normaliserCompetence, calculerMatching };
