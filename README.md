
### Backend

```bash
cd app/backend
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

### Frontend

```bash
cd app/frontend
npm install
npm run dev
```

El backend corre en `http://localhost:3000` y el frontend en `http://localhost:3001`.

