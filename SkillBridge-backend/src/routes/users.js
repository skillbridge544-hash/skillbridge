const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authRequise } = require("../middleware/auth");
const { serializeUser, serializeSkill, serializeProject, serializeOpportunity } = require("../lib/serializers");
const { calculerMatching } = require("../lib/matching");

const router = express.Router();

const includeProfilComplet = {
  skills: true,
  projects: { include: { competencesUtilisees: true } },
  mentorProfile: true,
};

const schemaPatchMe = z.object({
  nom: z.string().trim().min(2).max(100).optional(),
  photo_url: z.string().trim().max(255).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  localisation: z.string().trim().max(100).optional().nullable(),
  objectifs: z.string().optional().nullable(),
  disponibilite: z.string().trim().max(100).optional().nullable(),
  nom_entreprise: z.string().trim().max(150).optional().nullable(),
  secteur: z.string().trim().max(100).optional().nullable(),
  taille: z.string().trim().max(50).optional().nullable(),
  site_web: z.string().trim().max(255).optional().nullable(),
  identifiant_skillbridge: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Identifiant : lettres minuscules, chiffres et tirets.")
    .optional(),
  domaine_expertise: z.string().trim().max(100).optional(),
  experience: z.string().max(255).optional().nullable(),
});

router.get("/me", authRequise, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: includeProfilComplet,
    });
    return res.json(serializeUser(user));
  } catch (err) {
    return next(err);
  }
});

router.patch("/me", authRequise, async (req, res, next) => {
  try {
    const data = schemaPatchMe.parse(req.body);

    if (data.identifiant_skillbridge) {
      const pris = await prisma.user.findUnique({
        where: { identifiantSkillbridge: data.identifiant_skillbridge },
      });
      if (pris && pris.id !== req.user.id) {
        return res.status(409).json({ message: "Cet identifiant SkillBridge est déjà pris." });
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        nom: data.nom,
        photoUrl: data.photo_url,
        bio: data.bio,
        localisation: data.localisation,
        objectifs: data.objectifs,
        disponibilite: data.disponibilite,
        nomEntreprise: data.nom_entreprise,
        secteur: data.secteur,
        taille: data.taille,
        siteWeb: data.site_web,
        identifiantSkillbridge: data.identifiant_skillbridge,
        mentorProfile:
          req.user.role === "mentor" && (data.domaine_expertise || data.experience !== undefined || data.disponibilite)
            ? {
                upsert: {
                  create: {
                    domaineExpertise: data.domaine_expertise || "À préciser",
                    experience: data.experience,
                    disponibilite: data.disponibilite,
                  },
                  update: {
                    domaineExpertise: data.domaine_expertise,
                    experience: data.experience,
                    disponibilite: data.disponibilite,
                  },
                },
              }
            : undefined,
      },
      include: includeProfilComplet,
    });

    return res.json(serializeUser(user));
  } catch (err) {
    return next(err);
  }
});

router.get("/:id/skills", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    const skills = await prisma.skill.findMany({
      where: { userId: req.params.id },
      orderBy: { dateAjout: "desc" },
    });
    return res.json(skills.map(serializeSkill));
  } catch (err) {
    return next(err);
  }
});

router.get("/:id/projects", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    const projects = await prisma.project.findMany({
      where: { userId: req.params.id },
      include: { competencesUtilisees: true },
      orderBy: { dateCreation: "desc" },
    });
    return res.json(projects.map(serializeProject));
  } catch (err) {
    return next(err);
  }
});

/** Liste des opportunités matchées, triée par score décroissant. */
router.get("/:id/matches", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { skills: true },
    });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    const opportunities = await prisma.opportunity.findMany({
      where: { statut: "ouverte" },
      include: { competencesRequises: true, entreprise: true },
    });

    const matches = opportunities
      .map((opportunity) => {
        const detail = calculerMatching(user.skills, opportunity.competencesRequises);
        return {
          opportunity: serializeOpportunity(opportunity),
          score: detail.score,
          correspondances: detail.correspondances,
          manquantes: detail.manquantes,
        };
      })
      .sort((a, b) => b.score - a.score);

    return res.json(matches);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
