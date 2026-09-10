const express = require("express");
const prisma = require("../lib/prisma");
const { serializeUser } = require("../lib/serializers");

const router = express.Router();

/** Skill Passport public — aucune auth. */
router.get("/:identifiant_public", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { identifiantSkillbridge: req.params.identifiant_public },
      include: {
        skills: true,
        projects: { include: { competencesUtilisees: true } },
      },
    });

    if (!user) return res.status(404).json({ message: "Skill Passport introuvable." });

    const publicUser = serializeUser(user);
    delete publicUser.email;
    return res.json(publicUser);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
