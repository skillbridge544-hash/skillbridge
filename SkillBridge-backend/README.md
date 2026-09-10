# SkillBridge API

Backend Node.js (Express + Prisma + PostgreSQL) du hackathon SkillBridge.

Le frontend peut coder contre ce contrat : toutes les réponses sont en **snake_case**.

## Prérequis

- Node.js 18+

En local : PostgreSQL via Docker (`docker compose up -d`). En production : plugin PostgreSQL Railway.

## Lancement local

```bash
cd SkillBridge-backend
cp .env.example .env
docker compose up -d
npm install
npx prisma db push
npm run db:seed
npm run dev
```

API : http://localhost:4000  
Santé : http://localhost:4000/api/health

## Comptes de démo

Mot de passe commun : `Password123`

| Rôle       | Email                            | Passport              |
|------------|----------------------------------|-----------------------|
| Talent     | aminata@demo.skillbridge         | `aminata-diallo`      |
| Talent     | koffi@demo.skillbridge           | `koffi-mensah`        |
| Talent     | fatou@demo.skillbridge           | `fatou-sow`           |
| Mentor     | jean@demo.skillbridge            | `jean-kouassi`        |
| Entreprise | recrutement@inovcotonou.demo     | `inov-cotonou`        |

Exemple : `GET /api/passport/aminata-diallo`

Matching attendu (Aminata × Frontend React) : score élevé (React, JavaScript, HTML/CSS).

## Gérer la base de données

La base locale est PostgreSQL (Docker). Prisma s’occupe des tables.

| Commande | Rôle |
|----------|------|
| `npm run db:status` | Compter les lignes + lister les comptes |
| `npm run db:studio` | Interface visuelle (http://localhost:5555) : voir / modifier / supprimer |
| `npm run db:seed` | Recharger les données de démo (écrase le contenu actuel) |
| `npm run db:reset` | Recréer les tables à zéro + seed |
| `npm run db:push` | Appliquer `prisma/schema.prisma` sans tout casser |

Pour ajouter une colonne : modifier `prisma/schema.prisma`, puis `npm run db:push`.

## Auth

Header : `Authorization: Bearer <token>`

## Contrat d'API

Voir `CONTEXT.md`. Extras (CDC, n'existent pas dans le contrat frontend minimal) :

- `PATCH /api/opportunities/:id` — modifier / fermer (créateur uniquement)
- `GET /api/domaines/:domaine/suggestions-competences` — IDs à envoyer dans `competences_requises`

Domaines seedés : `Site web`, `Application mobile`, `Design graphique`, `Analyse de données`, `Rédaction/Contenu`.

`conversationId` messagerie : `{idPetit}_{idGrand}` des deux users.

## Déploiement Railway

1. Compte sur [railway.app](https://railway.app)
2. Dans le dossier du projet :

```bash
railway login --browserless
railway init
railway add --database postgres
railway variable set JWT_SECRET="$(openssl rand -hex 32)"
railway variable set JWT_EXPIRES_IN="7d"
railway variable set SEED_ON_START="true"
railway up
railway domain
```

3. Après le premier seed, couper le re-seed :

```bash
railway variable set SEED_ON_START="false"
```

`DATABASE_URL` est injecté automatiquement par le plugin Postgres.

Ne jamais committer `.env`.
