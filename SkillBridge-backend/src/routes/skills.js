const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authRequise, roleRequis } = require("../middleware/auth");
const { serializeSkill } = require("../lib/serializers");
const { normaliserCompetence } = require("../lib/matching");

const router = express.Router();

const schemaSkill = z.object({
  nom_competence: z.string().trim().min(1, "Le nom de la compétence est obligatoire.").max(100),
  niveau: z.enum(["debutant", "intermediaire", "avance", "expert"]),
  domaine: z.string().trim().max(100).optional().nullable(),
});

router.post("/", authRequise, roleRequis("talent", "mentor"), async (req, res, next) => {
  try {
    const data = schemaSkill.parse(req.body);
    const nom = data.nom_competence.trim();

    const existants = await prisma.skill.findMany({ where: { userId: req.user.id } });
    const doublon = existants.find(
      (s) => normaliserCompetence(s.nomCompetence) === normaliserCompetence(nom)
    );
    if (doublon) {
      return res.status(409).json({ message: "Cette compétence est déjà déclarée sur votre profil." });
    }

    const skill = await prisma.skill.create({
      data: {
        userId: req.user.id,
        nomCompetence: nom,
        niveau: data.niveau,
        domaine: data.domaine || null,
      },
    });

    return res.status(201).json(serializeSkill(skill));
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", authRequise, async (req, res, next) => {
  try {
    const skill = await prisma.skill.findUnique({ where: { id: req.params.id } });
    if (!skill) return res.status(404).json({ message: "Compétence introuvable." });
    if (skill.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous ne pouvez supprimer que vos propres compétences." });
    }

    await prisma.skill.delete({ where: { id: skill.id } });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
