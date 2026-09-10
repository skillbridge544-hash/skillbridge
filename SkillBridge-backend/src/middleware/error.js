function errorHandler(err, req, res, _next) {
  console.error(err);

  if (err.code === "P2002") {
    return res.status(409).json({ message: "Cette valeur existe déjà (contrainte unique)." });
  }

  if (err.name === "ZodError") {
    const details = (err.issues || []).map((i) => i.message);
    return res.status(400).json({ message: "Données invalides.", details });
  }

  const status = err.status || 500;
  return res.status(status).json({
    message: err.message || "Erreur serveur.",
  });
}

module.exports = { errorHandler };
