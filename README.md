# SkillBridge

Plateforme qui connecte talents, mentors et entreprises.

```
skillbridge/
├── SkillBridge-backend/   # API Node.js (Express + Prisma)
└── SkillBridge-frontend/  # à ajouter par l'équipe frontend
```

## Backend

```bash
cd SkillBridge-backend
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

API locale : http://localhost:4000  
Détails : [SkillBridge-backend/README.md](SkillBridge-backend/README.md)

## Frontend

Déposer le projet React/Vue dans `SkillBridge-frontend/`.
