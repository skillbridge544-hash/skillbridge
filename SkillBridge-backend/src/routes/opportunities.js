const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authRequise, roleRequis } = require("../middleware/auth");
const { serializeOpportunity } = require("../lib/serializers");
const { calculerMatching, normaliserCompetence } = require("../lib/matching");

const router = express.Router();

const schemaCreate = z.object({
  titre: z.string().trim().min(1).max(150),
  type: z.enum(["emploi", "stage", "mission", "collaboration"]),
  description: z.string().trim().min(1),
  competences_requises: z.array(z.string()).optional().default([]),
  niveau_attendu: z.enum(["debutant", "intermediaire", "avance", "expert"]).optional().nullable(),
  domaine_general: z.string().trim().max(100).optional().nullable(),
  mode: z.enum(["standard", "generique"]).optional().default("standard"),
});

const schemaPatch = schemaCreate.partial().extend({
  statut: z.enum(["ouverte", "fermee"]).optional(),
});

const includeOpp = { competencesRequises: true, entreprise: true };

router.get("/", async (req, res, next) => {
  try {
    const { competence, type, domaine } = req.query;
    const opportunities = await prisma.opportunity.findMany({
      where: {
        statut: "ouverte",
        type: type || undefined,
        domaineGeneral: domaine || undefined,
      },
      include: includeOpp,
      orderBy: { datePublication: "desc" },
    });

    let result = opportunities;
    if (competence) {
      const cible = normaliserCompetence(competence);
      result = opportunities.filter((o) =>
        o.competencesRequises.some((s) => normaliserCompetence(s.nomCompetence) === cible)
      );
    }

    return res.json(result.map(serializeOpportunity));
  } catch (err) {
    return next(err);
  }
});

router.post("/", authRequise, roleRequis("entreprise"), async (req, res, next) => {
  try {
    const data = schemaCreate.parse(req.body);
    const mode = data.mode || (data.competences_requises.length === 0 ? "generique" : "standard");

    if (mode === "standard" && data.competences_requises.length === 0) {
      return res.status(400).json({
        message: "Une opportunité standard doit avoir au moins une compétence requise (ou passez mode=generique).",
      });
    }

    if (data.competences_requises.length > 0) {
      const skills = await prisma.skill.findMany({
        where: { id: { in: data.competences_requises } },
      });
      if (skills.length !== data.competences_requises.length) {
        return res.status(400).json({ message: "Une ou plusieurs compétences requises sont introuvables." });
      }
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        entrepriseId: req.user.id,
        titre: data.titre,
        type: data.type,
        description: data.description,
        domaineGeneral: data.domaine_general || null,
        niveauAttendu: data.niveau_attendu || null,
        mode,
        competencesRequises: {
          connect: data.competences_requises.map((id) => ({ id })),
        },
      },
      include: includeOpp,
    });

    return res.status(201).json(serializeOpportunity(opportunity));
  } catch (err) {
    return next(err);
  }
});

router.get("/:id/match/:userId", async (req, res, next) => {
  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: req.params.id },
      include: { competencesRequises: true },
    });
    if (!opportunity) return res.status(404).json({ message: "Opportunité introuvable." });

    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: { skills: true },
    });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    return res.json(calculerMatching(user.skills, opportunity.competencesRequises));
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: req.params.id },
      include: includeOpp,
    });
    if (!opportunity) return res.status(404).json({ message: "Opportunité introuvable." });
    return res.json(serializeOpportunity(opportunity));
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", authRequise, async (req, res, next) => {
  try {
    const existant = await prisma.opportunity.findUnique({ where: { id: req.params.id } });
    if (!existant) return res.status(404).json({ message: "Opportunité introuvable." });
    if (existant.entrepriseId !== req.user.id) {
      return res.status(403).json({ message: "Seul le créateur peut modifier cette opportunité." });
    }

    const data = schemaPatch.parse(req.body);

    if (data.competences_requises) {
      const skills = await prisma.skill.findMany({
        where: { id: { in: data.competences_requises } },
      });
      if (skills.length !== data.competences_requises.length) {
        return res.status(400).json({ message: "Une ou plusieurs compétences requises sont introuvables." });
      }
    }

    const opportunity = await prisma.opportunity.update({
      where: { id: existant.id },
      data: {
        titre: data.titre,
        type: data.type,
        description: data.description,
        domaineGeneral: data.domaine_general,
        niveauAttendu: data.niveau_attendu,
        mode: data.mode,
        statut: data.statut,
        competencesRequises: data.competences_requises
          ? { set: data.competences_requises.map((id) => ({ id })) }
          : undefined,
      },
      include: includeOpp,
    });

    return res.json(serializeOpportunity(opportunity));
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
