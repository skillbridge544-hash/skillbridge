const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { genererIdentifiant } = require("../lib/identifiant");
const { signerToken } = require("../lib/jwt");
const { serializeUser } = require("../lib/serializers");

const router = express.Router();

const schemaRegister = z.object({
  nom: z.string().trim().min(2, "Le nom est obligatoire.").max(100),
  email: z.string().trim().email("Email invalide.").max(150),
  mot_de_passe: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  role: z.enum(["talent", "mentor", "entreprise"]),
});

const schemaLogin = z.object({
  email: z.string().trim().email("Email invalide."),
  mot_de_passe: z.string().min(1, "Mot de passe requis."),
});

router.post("/register", async (req, res, next) => {
  try {
    const data = schemaRegister.parse(req.body);
    const email = data.email.toLowerCase();

    const existant = await prisma.user.findUnique({ where: { email } });
    if (existant) {
      return res.status(409).json({ message: "Un compte existe déjà avec cet email." });
    }

    const motDePasseHash = await bcrypt.hash(data.mot_de_passe, 10);
    const identifiantSkillbridge = await genererIdentifiant(prisma, data.nom);

    const user = await prisma.user.create({
      data: {
        nom: data.nom,
        email,
        motDePasseHash,
        role: data.role,
        identifiantSkillbridge,
        // Profil mentor vide prêt à être complété
        mentorProfile:
          data.role === "mentor"
            ? { create: { domaineExpertise: "À préciser", experience: null, disponibilite: null } }
            : undefined,
      },
      include: { mentorProfile: true },
    });

    const token = signerToken(user);
    return res.status(201).json({ token, user: serializeUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = schemaLogin.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      include: { mentorProfile: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const ok = await bcrypt.compare(data.mot_de_passe, user.motDePasseHash);
    if (!ok) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const token = signerToken(user);
    return res.json({ token, user: serializeUser(user) });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
