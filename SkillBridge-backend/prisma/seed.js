require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const MOT_DE_PASSE = "Password123";

const CATALOGUE = {
  "Site web": ["JavaScript", "React", "Node.js", "HTML/CSS", "PostgreSQL"],
  "Application mobile": ["Flutter", "React Native", "Dart", "Firebase"],
  "Design graphique": ["Figma", "UI/UX", "Design graphique", "Adobe XD"],
  "Analyse de données": ["Python", "SQL", "Analyse de données", "Excel"],
  "Rédaction/Contenu": ["Rédaction", "SEO", "Copywriting"],
};

async function creerUser(data) {
  return prisma.user.create({ data });
}

async function main() {
  console.log("Nettoyage de la base…");
  await prisma.message.deleteMany();
  await prisma.mentorshipRequest.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.mentorProfile.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash(MOT_DE_PASSE, 10);

  const catalogue = await creerUser({
    nom: "Catalogue SkillBridge",
    email: "catalogue@skillbridge.local",
    motDePasseHash: hash,
    role: "entreprise",
    identifiantSkillbridge: "catalogue-skillbridge",
    bio: "Compte interne — compétences suggérées par domaine.",
  });

  const skillsParNom = {};
  for (const [domaine, noms] of Object.entries(CATALOGUE)) {
    for (const nom of noms) {
      const skill = await prisma.skill.create({
        data: {
          userId: catalogue.id,
          nomCompetence: nom,
          niveau: "intermediaire",
          domaine,
        },
      });
      skillsParNom[nom] = skill;
    }
  }

  const aminata = await creerUser({
    nom: "Aminata Diallo",
    email: "aminata@demo.skillbridge",
    motDePasseHash: hash,
    role: "talent",
    identifiantSkillbridge: "aminata-diallo",
    bio: "Développeuse fullstack passionnée par le web africain.",
    localisation: "Cotonou, Bénin",
    objectifs: "Trouver un poste frontend ou fullstack.",
    disponibilite: "temps plein",
    photoUrl: "https://i.pravatar.cc/150?u=aminata",
  });

  const koffi = await creerUser({
    nom: "Koffi Mensah",
    email: "koffi@demo.skillbridge",
    motDePasseHash: hash,
    role: "talent",
    identifiantSkillbridge: "koffi-mensah",
    bio: "Analyste data, Python et SQL au quotidien.",
    localisation: "Lomé, Togo",
    objectifs: "Stage ou mission data.",
    disponibilite: "stage",
    photoUrl: "https://i.pravatar.cc/150?u=koffi",
  });

  const fatou = await creerUser({
    nom: "Fatou Sow",
    email: "fatou@demo.skillbridge",
    motDePasseHash: hash,
    role: "talent",
    identifiantSkillbridge: "fatou-sow",
    bio: "Designer UI/UX, je rends les produits clairs et beaux.",
    localisation: "Dakar, Sénégal",
    objectifs: "Missions design produit.",
    disponibilite: "freelance",
    photoUrl: "https://i.pravatar.cc/150?u=fatou",
  });

  async function ajouterSkills(userId, items) {
    const created = [];
    for (const item of items) {
      created.push(
        await prisma.skill.create({
          data: { userId, nomCompetence: item.nom, niveau: item.niveau, domaine: item.domaine },
        })
      );
    }
    return created;
  }

  const skillsAminata = await ajouterSkills(aminata.id, [
    { nom: "React", niveau: "avance", domaine: "Site web" },
    { nom: "JavaScript", niveau: "expert", domaine: "Site web" },
    { nom: "Node.js", niveau: "intermediaire", domaine: "Site web" },
    { nom: "HTML/CSS", niveau: "avance", domaine: "Site web" },
  ]);

  const skillsKoffi = await ajouterSkills(koffi.id, [
    { nom: "Python", niveau: "avance", domaine: "Analyse de données" },
    { nom: "Analyse de données", niveau: "avance", domaine: "Analyse de données" },
    { nom: "SQL", niveau: "intermediaire", domaine: "Analyse de données" },
  ]);

  const skillsFatou = await ajouterSkills(fatou.id, [
    { nom: "Figma", niveau: "expert", domaine: "Design graphique" },
    { nom: "Design graphique", niveau: "avance", domaine: "Design graphique" },
    { nom: "UI/UX", niveau: "avance", domaine: "Design graphique" },
  ]);

  await prisma.project.create({
    data: {
      userId: aminata.id,
      titre: "Plateforme de cours en ligne",
      description: "Application React + Node pour des formations courtes au Bénin.",
      role: "Développeuse fullstack",
      contexte: "personnel",
      medias: [{ type: "lien", url: "https://github.com/demo/cours-benin" }],
      competencesUtilisees: { connect: skillsAminata.slice(0, 3).map((s) => ({ id: s.id })) },
    },
  });

  await prisma.project.create({
    data: {
      userId: koffi.id,
      titre: "Tableau de bord ventes PME",
      description: "Analyse Python/SQL des ventes d'une PME de Lomé.",
      role: "Data analyst",
      contexte: "professionnel",
      medias: [{ type: "lien", url: "https://github.com/demo/dashboard-pme" }],
      competencesUtilisees: { connect: skillsKoffi.map((s) => ({ id: s.id })) },
    },
  });

  await prisma.project.create({
    data: {
      userId: fatou.id,
      titre: "Refonte app mobile fintech",
      description: "Design system et maquettes Figma pour une fintech Dakar.",
      role: "Lead UI/UX",
      contexte: "professionnel",
      medias: [{ type: "image", url: "https://picsum.photos/seed/fatou/800/500" }],
      competencesUtilisees: { connect: skillsFatou.map((s) => ({ id: s.id })) },
    },
  });

  const jean = await creerUser({
    nom: "Jean Kouassi",
    email: "jean@demo.skillbridge",
    motDePasseHash: hash,
    role: "mentor",
    identifiantSkillbridge: "jean-kouassi",
    bio: "10 ans en produit digital, j'accompagne les juniors web.",
    localisation: "Abidjan, Côte d'Ivoire",
    photoUrl: "https://i.pravatar.cc/150?u=jean",
    mentorProfile: {
      create: {
        domaineExpertise: "Développement web",
        experience: "10 ans — CTO de deux startups",
        disponibilite: "2 créneaux / semaine",
      },
    },
  });

  const entreprise = await creerUser({
    nom: "Awa Kone",
    email: "recrutement@inovcotonou.demo",
    motDePasseHash: hash,
    role: "entreprise",
    identifiantSkillbridge: "inov-cotonou",
    bio: "Startup produit digital à Cotonou.",
    localisation: "Cotonou, Bénin",
    nomEntreprise: "Inov Cotonou",
    secteur: "Tech",
    taille: "11-50",
    siteWeb: "https://inov-cotonou.demo",
    photoUrl: "https://i.pravatar.cc/150?u=inov",
  });

  await prisma.opportunity.create({
    data: {
      entrepriseId: entreprise.id,
      titre: "Développeur Frontend React",
      type: "emploi",
      description: "Nous cherchons un profil React pour notre produit RH.",
      domaineGeneral: "Site web",
      niveauAttendu: "avance",
      mode: "standard",
      competencesRequises: {
        connect: ["React", "JavaScript", "HTML/CSS"].map((n) => ({ id: skillsParNom[n].id })),
      },
    },
  });

  await prisma.opportunity.create({
    data: {
      entrepriseId: entreprise.id,
      titre: "Stage Data Analyst",
      type: "stage",
      description: "Stage de 3 mois : dashboards et requêtes SQL.",
      domaineGeneral: "Analyse de données",
      niveauAttendu: "intermediaire",
      mode: "standard",
      competencesRequises: {
        connect: ["Python", "Analyse de données", "SQL"].map((n) => ({ id: skillsParNom[n].id })),
      },
    },
  });

  await prisma.opportunity.create({
    data: {
      entrepriseId: entreprise.id,
      titre: "Mission Design UI application",
      type: "mission",
      description: "Refonte des écrans clés de notre app mobile.",
      domaineGeneral: "Design graphique",
      niveauAttendu: "avance",
      mode: "standard",
      competencesRequises: {
        connect: ["Figma", "Design graphique", "UI/UX"].map((n) => ({ id: skillsParNom[n].id })),
      },
    },
  });

  await prisma.opportunity.create({
    data: {
      entrepriseId: entreprise.id,
      titre: "Fullstack Node / React",
      type: "emploi",
      description: "Profil hybride frontend + API Node et PostgreSQL.",
      domaineGeneral: "Site web",
      niveauAttendu: "intermediaire",
      mode: "standard",
      competencesRequises: {
        connect: ["React", "Node.js", "PostgreSQL"].map((n) => ({ id: skillsParNom[n].id })),
      },
    },
  });

  await prisma.mentorshipRequest.create({
    data: { talentId: aminata.id, mentorId: jean.id, statut: "en_attente" },
  });

  console.log("Seed OK. Comptes de démo (mot de passe : Password123)");
  console.log("  Talent     aminata@demo.skillbridge   → fort match React");
  console.log("  Talent     koffi@demo.skillbridge     → fort match Data");
  console.log("  Talent     fatou@demo.skillbridge     → fort match Design");
  console.log("  Mentor     jean@demo.skillbridge");
  console.log("  Entreprise recrutement@inovcotonou.demo");
  console.log("  Passport   /api/passport/aminata-diallo");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
