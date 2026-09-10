# SkillBridge — Contexte projet (référence Cursor)

## Le projet en une phrase

SkillBridge connecte les compétences, les preuves de réalisation, le mentorat et les opportunités entre **Talents**, **Mentors** et **Entreprises**. Backend Node.js développé en parallèle du frontend React/Vue. Hackathon 24-48h : prioriser un backend fonctionnel et stable.

## Stack

- Backend : Node.js + Express
- BDD : PostgreSQL (Prisma) — Docker en local, plugin Railway en prod
- Auth : JWT + bcrypt
- Déploiement : Render ou Railway

## Contrat d'API (ne pas changer sans accord équipe)

```
POST   /api/auth/register        { nom, email, mot_de_passe, role } → { token, user }
POST   /api/auth/login           { email, mot_de_passe } → { token, user }
GET    /api/users/me             (auth) → profil complet
PATCH  /api/users/me             (auth) { photo_url?, bio?, objectifs?, ... }

GET    /api/users/:id/skills     → Skill[]
POST   /api/skills               (auth) { nom_competence, niveau, domaine }
DELETE /api/skills/:id           (auth)
GET    /api/passport/:identifiant_public   → profil public + skills + projects (SANS auth)

GET    /api/users/:id/projects   → Project[]
POST   /api/projects             (auth) { titre, description, role, contexte, competences_utilisees: [skillIds], medias: [{type, url}] }
PATCH  /api/projects/:id         (auth)
DELETE /api/projects/:id         (auth)

GET    /api/opportunities        ?competence=&type=&domaine=
POST   /api/opportunities        (auth, role=entreprise) { titre, type, description, competences_requises: [skillIds], niveau_attendu }
GET    /api/opportunities/:id
PATCH  /api/opportunities/:id    (auth, créateur) — extra CDC pour modifier/fermer

GET    /api/opportunities/:id/match/:userId
       → { score, correspondances, manquantes }
GET    /api/users/:id/matches    → [{ opportunity, score, correspondances, manquantes }]

GET    /api/mentors
POST   /api/mentorship-requests  (auth) { mentor_id }
PATCH  /api/mentorship-requests/:id  { statut }
GET    /api/messages/:conversationId
POST   /api/messages             (auth) { destinataire_id, contenu }

GET    /api/domaines/:domaine/suggestions-competences  — extra CDC 8.4
```

## Règles métier

- Pas de doublon `nom_competence` pour un même `user_id`
- Un projet doit avoir au moins une compétence
- Une opportunité **standard** doit avoir au moins une compétence requise ; **generique** autorise une liste vide
- Un talent ne peut pas avoir deux demandes `en_attente` vers le même mentor
- Matching : `score = (compétences communes / compétences requises) × 100` + détail obligatoire
- Entreprise : pas de Skill/Project. Talent/Mentor : pas d'Opportunity
- Réponses API en **snake_case**. Jamais de `mot_de_passe_hash` exposé

## Priorités

1. Auth, Skills, Projects, Opportunities, Matching
2. Mentorat, Messagerie
3. Filtres avancés, pagination, upload réel (URL suffit)
