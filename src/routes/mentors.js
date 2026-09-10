const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authRequise, roleRequis } = require("../middleware/auth");
const { serializeUser, serializeMentorshipRequest } = require("../lib/serializers");

const router = express.Router();

router.get("/mentors", async (req, res, next) => {
  try {
    const { domaine } = req.query;
    const mentors = await prisma.user.findMany({
      where: {
        role: "mentor",
        mentorProfile: { isNot: null },
      },
      include: { mentorProfile: true, skills: true },
      orderBy: { dateCreation: "desc" },
    });

    const filtre = domaine ? String(domaine).toLowerCase() : "";
    const filtered = filtre
      ? mentors.filter((m) =>
          (m.mentorProfile?.domaineExpertise || "").toLowerCase().includes(filtre)
        )
      : mentors;

    return res.json(filtered.map((m) => serializeUser(m)));
  } catch (err) {
    return next(err);
  }
});

router.post("/mentorship-requests", authRequise, roleRequis("talent"), async (req, res, next) => {
  try {
    const { mentor_id } = z.object({ mentor_id: z.string().min(1) }).parse(req.body);

    const mentor = await prisma.user.findUnique({ where: { id: mentor_id } });
    if (!mentor || mentor.role !== "mentor") {
      return res.status(400).json({ message: "Mentor introuvable." });
    }

    const enAttente = await prisma.mentorshipRequest.findFirst({
      where: { talentId: req.user.id, mentorId: mentor_id, statut: "en_attente" },
    });
    if (enAttente) {
      return res.status(409).json({
        message: "Une demande en attente existe déjà vers ce mentor.",
      });
    }

    const demande = await prisma.mentorshipRequest.create({
      data: { talentId: req.user.id, mentorId: mentor_id },
      include: { talent: true, mentor: true },
    });

    return res.status(201).json(serializeMentorshipRequest(demande));
  } catch (err) {
    return next(err);
  }
});

router.patch("/mentorship-requests/:id", authRequise, async (req, res, next) => {
  try {
    const { statut } = z.object({ statut: z.enum(["accepte", "refuse"]) }).parse(req.body);

    const demande = await prisma.mentorshipRequest.findUnique({
      where: { id: req.params.id },
    });
    if (!demande) return res.status(404).json({ message: "Demande introuvable." });
    if (demande.mentorId !== req.user.id) {
      return res.status(403).json({ message: "Seul le mentor concerné peut changer le statut." });
    }
    if (demande.statut !== "en_attente") {
      return res.status(400).json({ message: "Cette demande a déjà été traitée." });
    }

    const updated = await prisma.mentorshipRequest.update({
      where: { id: demande.id },
      data: { statut },
      include: { talent: true, mentor: true },
    });

    return res.json(serializeMentorshipRequest(updated));
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
