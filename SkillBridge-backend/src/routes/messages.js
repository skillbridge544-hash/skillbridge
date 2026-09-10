const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { authRequise } = require("../middleware/auth");
const { serializeMessage } = require("../lib/serializers");

const router = express.Router();

/** conversationId = "idPetit_idGrand" des deux utilisateurs. */
function idsDepuisConversation(conversationId) {
  const parts = String(conversationId).split("_");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return parts;
}

router.get("/:conversationId", authRequise, async (req, res, next) => {
  try {
    const ids = idsDepuisConversation(req.params.conversationId);
    if (!ids) {
      return res.status(400).json({
        message: "conversationId invalide. Format attendu : {userIdA}_{userIdB} (ids triés).",
      });
    }

    if (!ids.includes(req.user.id)) {
      return res.status(403).json({ message: "Vous n'êtes pas participant de cette conversation." });
    }

    const [a, b] = ids;
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { expediteurId: a, destinataireId: b },
          { expediteurId: b, destinataireId: a },
        ],
      },
      orderBy: { dateEnvoi: "asc" },
    });

    // Marquer comme lus les messages reçus
    await prisma.message.updateMany({
      where: { destinataireId: req.user.id, expediteurId: ids.find((id) => id !== req.user.id), lu: false },
      data: { lu: true },
    });

    return res.json(messages.map(serializeMessage));
  } catch (err) {
    return next(err);
  }
});

router.post("/", authRequise, async (req, res, next) => {
  try {
    const data = z
      .object({
        destinataire_id: z.string().min(1),
        contenu: z.string().trim().min(1, "Le message ne peut pas être vide."),
      })
      .parse(req.body);

    if (data.destinataire_id === req.user.id) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous envoyer un message." });
    }

    const dest = await prisma.user.findUnique({ where: { id: data.destinataire_id } });
    if (!dest) return res.status(404).json({ message: "Destinataire introuvable." });

    const message = await prisma.message.create({
      data: {
        expediteurId: req.user.id,
        destinataireId: data.destinataire_id,
        contenu: data.contenu,
      },
    });

    return res.status(201).json(serializeMessage(message));
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
