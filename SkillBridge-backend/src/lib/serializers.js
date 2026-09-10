function serializeSkill(skill) {
  if (!skill) return null;
  return {
    id: skill.id,
    user_id: skill.userId,
    nom_competence: skill.nomCompetence,
    niveau: skill.niveau,
    domaine: skill.domaine,
    date_ajout: skill.dateAjout,
  };
}

function serializeProject(project) {
  if (!project) return null;
  return {
    id: project.id,
    user_id: project.userId,
    titre: project.titre,
    description: project.description,
    role: project.role,
    contexte: project.contexte,
    competences_utilisees: (project.competencesUtilisees || []).map(serializeSkill),
    medias: project.medias || [],
    date_creation: project.dateCreation,
  };
}

function serializeUser(user, extras = {}) {
  if (!user) return null;
  const base = {
    id: user.id,
    nom: user.nom,
    email: user.email,
    role: user.role,
    photo_url: user.photoUrl,
    identifiant_skillbridge: user.identifiantSkillbridge,
    bio: user.bio,
    localisation: user.localisation,
    objectifs: user.objectifs,
    disponibilite: user.disponibilite,
    nom_entreprise: user.nomEntreprise,
    secteur: user.secteur,
    taille: user.taille,
    site_web: user.siteWeb,
    date_creation: user.dateCreation,
  };

  if (user.skills) base.skills = user.skills.map(serializeSkill);
  if (user.projects) base.projects = user.projects.map(serializeProject);
  if (user.mentorProfile) {
    base.mentor_profile = {
      id: user.mentorProfile.id,
      user_id: user.mentorProfile.userId,
      domaine_expertise: user.mentorProfile.domaineExpertise,
      experience: user.mentorProfile.experience,
      disponibilite: user.mentorProfile.disponibilite,
    };
  }

  return { ...base, ...extras };
}

function serializeOpportunity(opp) {
  if (!opp) return null;
  return {
    id: opp.id,
    entreprise_id: opp.entrepriseId,
    titre: opp.titre,
    type: opp.type,
    description: opp.description,
    domaine_general: opp.domaineGeneral,
    competences_requises: (opp.competencesRequises || []).map(serializeSkill),
    niveau_attendu: opp.niveauAttendu,
    mode: opp.mode,
    statut: opp.statut,
    date_publication: opp.datePublication,
    entreprise: opp.entreprise
      ? {
          id: opp.entreprise.id,
          nom: opp.entreprise.nom,
          photo_url: opp.entreprise.photoUrl,
          nom_entreprise: opp.entreprise.nomEntreprise,
          secteur: opp.entreprise.secteur,
        }
      : undefined,
  };
}

function serializeMentorshipRequest(req) {
  if (!req) return null;
  return {
    id: req.id,
    talent_id: req.talentId,
    mentor_id: req.mentorId,
    statut: req.statut,
    date: req.date,
    talent: req.talent ? serializeUser(req.talent) : undefined,
    mentor: req.mentor ? serializeUser(req.mentor) : undefined,
  };
}

function serializeMessage(msg) {
  if (!msg) return null;
  return {
    id: msg.id,
    expediteur_id: msg.expediteurId,
    destinataire_id: msg.destinataireId,
    contenu: msg.contenu,
    date_envoi: msg.dateEnvoi,
    lu: msg.lu,
  };
}

module.exports = {
  serializeSkill,
  serializeProject,
  serializeUser,
  serializeOpportunity,
  serializeMentorshipRequest,
  serializeMessage,
};
