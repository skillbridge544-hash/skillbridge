const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authRequise, roleRequis } = require("../middleware/auth");
const { serializeProject } = require("../lib/serializers");

const router = express.Router();

const schemaMedia = z.object({
  type: z.string().trim().min(1),
  url: z.string().trim().min(1),
});

const schemaCreate = z.object({
  titre: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1),
  role: z.string().trim().max(150).optional().nullable(),
  contexte: z.enum(["academique", "professionnel", "personnel"]).optional().nullable(),
  competences_utilisees: z.array(z.string().min(1)).min(1, "Un projet doit avoir au moins une compétence."),
  medias: z.array(schemaMedia).optional().default([]),
});

const schemaPatch = schemaCreate.partial().extend({
  competences_utilisees: z.array(z.string().min(1)).min(1).optional(),
});

async function verifierCompetencesUtilisateur(userId, skillIds) {
  const skills = await prisma.skill.findMany({
    where: { id: { in: skillIds }, userId },
  });
  if (skills.length !== skillIds.length) {
    const err = new Error("Une ou plusieurs compétences ne vous appartiennent pas.");
    err.status = 400;
    throw err;
  }
  return skills;
}

router.post("/", authRequise, roleRequis("talent", "mentor"), async (req, res, next) => {
  try {
    const data = schemaCreate.parse(req.body);
    await verifierCompetencesUtilisateur(req.user.id, data.competences_utilisees);

    const project = await prisma.project.create({
      data: {
        userId: req.user.id,
        titre: data.titre,
        description: data.description,
        role: data.role || null,
        contexte: data.contexte || null,
        medias: data.medias,
        competencesUtilisees: { connect: data.competences_utilisees.map((id) => ({ id })) },
      },
      include: { competencesUtilisees: true },
    });

    return res.status(201).json(serializeProject(project));
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", authRequise, async (req, res, next) => {
  try {
    const existant = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!existant) return res.status(404).json({ message: "Projet introuvable." });
    if (existant.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous ne pouvez modifier que vos propres projets." });
    }

    const data = schemaPatch.parse(req.body);
    if (data.competences_utilisees) {
      await verifierCompetencesUtilisateur(req.user.id, data.competences_utilisees);
    }

    const project = await prisma.project.update({
      where: { id: existant.id },
      data: {
        titre: data.titre,
        description: data.description,
        role: data.role,
        contexte: data.contexte,
        medias: data.medias,
        competencesUtilisees: data.competences_utilisees
          ? { set: data.competences_utilisees.map((id) => ({ id })) }
          : undefined,
      },
      include: { competencesUtilisees: true },
    });

    return res.json(serializeProject(project));
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", authRequise, async (req, res, next) => {
  try {
    const existant = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!existant) return res.status(404).json({ message: "Projet introuvable." });
    if (existant.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous ne pouvez supprimer que vos propres projets." });
    }

    await prisma.project.delete({ where: { id: existant.id } });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
