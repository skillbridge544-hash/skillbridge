const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

function extraireToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/** Vérifie le JWT et charge l'utilisateur courant. */
async function authRequise(req, res, next) {
  try {
    const token = extraireToken(req);
    if (!token) {
      return res.status(401).json({ message: "Authentification requise." });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Token invalide ou expiré." });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable." });
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

function roleRequis(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé pour ce rôle." });
    }
    return next();
  };
}

module.exports = { authRequise, roleRequis, extraireToken };
