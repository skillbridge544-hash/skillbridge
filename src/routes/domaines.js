const express = require("express");
const prisma = require("../lib/prisma");
const { serializeSkill } = require("../lib/serializers");

const router = express.Router();

/**
 * Suggestions de compétences pour un domaine (CDC 8.4).
 * S'appuie sur le catalogue seedé (utilisateur skillbridge-catalogue).
 */
router.get("/:domaine/suggestions-competences", async (req, res, next) => {
  try {
    const catalogue = await prisma.user.findUnique({
      where: { email: "catalogue@skillbridge.local" },
    });

    if (!catalogue) return res.json([]);

    const skills = await prisma.skill.findMany({
      where: { userId: catalogue.id },
    });

    const domaine = String(req.params.domaine).toLowerCase();
    const filtered = skills.filter((s) => (s.domaine || "").toLowerCase() === domaine);

    return res.json(filtered.map(serializeSkill));
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
