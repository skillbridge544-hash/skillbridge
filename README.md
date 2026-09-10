# SkillBridge

Plateforme qui connecte talents, mentors et entreprises.

```
skillbridge/
├── SkillBridge-backend/   # API Node.js (Express + Prisma)
└── SkillBridge-frontend/  # plan B React (logos + API Railway)
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

## Frontend (plan B)

```bash
cd SkillBridge-frontend
npm install
npm run dev
```

http://localhost:5173 — branché sur l’API Railway.  
Si Rosaire / Sabalimath livrent à temps, on utilise **leur** frontend.
