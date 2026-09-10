# SIMA AUTO — Site vitrine + back-office (Next.js + MySQL)

Reconstruction complète de la maquette fournie (`Home.html`, `inventory.html`, `detail.html`,
`add-vehicle.html`, `admin.html`, `contact.html`, `db.sql`) en application **Next.js 14 (App
Router) + Prisma + MySQL**, prête à héberger sur **Vercel**.

Le design (thème sombre / accent doré "SIMA AUTO") a été repris à l'identique en composants
React/Tailwind. La base de données reprend le schéma `db.sql` fourni (vehicles,
vehicle_technical_data, features, vehicle_features, vehicle_gallery, leads), avec deux ajouts :

- une colonne `is_hero` sur `vehicle_gallery` pour gérer la **photo principale** parmi les 15–20
  photos uploadées ;
- une table `admins` pour le compte de connexion de l'espace gestion.

## Fonctionnalités

- **Accueil** : bannière + section "Arrivages Récents" qui affiche automatiquement les derniers
  véhicules ajoutés (triés par date de création).
- **Inventaire** : liste filtrable (marque, budget max, kilométrage max, recherche).
- **Fiche véhicule** : galerie photo, fiche technique complète, liste d'équipements, boutons
  Appel / WhatsApp / "Demander un rappel" (chaque contact est enregistré comme lead).
- **Contact** : formulaire + coordonnées.
- **Espace Admin** (`/admin`, protégé par mot de passe) :
  - tableau de bord avec statut, mise en vitrine, nombre de leads, modification, suppression ;
  - formulaire d'ajout / modification de véhicule reprenant tous les champs de la fiche
    technique et la liste des équipements ;
  - **upload de 15 à 20 photos** par glisser-déposer ou sélection multiple, avec **sélection de
    la photo principale** (celle utilisée dans les listes) via un simple clic sur l'étoile.

## Stack technique

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM + MySQL
- Authentification admin par cookie de session signé (JWT via `jose`), mot de passe hashé
  (`bcryptjs`)
- Stockage des photos : **Vercel Blob** en production (obligatoire sur Vercel, dont le système de
  fichiers est en lecture seule), avec repli automatique sur `/public/uploads` en local si aucun
  token Blob n'est configuré.

## Installation locale

```bash
npm install
cp .env.example .env
# Renseignez DATABASE_URL, SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD dans .env

npx prisma db push      # crée les tables dans MySQL à partir de prisma/schema.prisma
npm run db:seed         # crée le compte admin + la liste des équipements (+ 1 véhicule d'exemple)

npm run dev             # http://localhost:3000
```

Connexion admin : `http://localhost:3000/admin/login` avec `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

En local, tant que `BLOB_READ_WRITE_TOKEN` n'est pas renseigné, les photos uploadées sont
enregistrées dans `public/uploads/`.

## Déploiement sur Vercel

1. **Base de données MySQL** : créez une base chez un hébergeur compatible Vercel (PlanetScale,
   Railway, Aiven, TiDB Cloud...) et récupérez l'URL de connexion.
2. **Stockage photos** : dans le dashboard Vercel du projet → *Storage* → *Create Database* →
   *Blob*. Copiez le `BLOB_READ_WRITE_TOKEN` généré.
3. Importez le dépôt sur Vercel, puis renseignez dans *Settings → Environment Variables* :
   - `DATABASE_URL`
   - `SESSION_SECRET` (chaîne aléatoire longue)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - `BLOB_READ_WRITE_TOKEN`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
4. Avant le premier déploiement (ou depuis votre machine, pointée sur la base de prod) :
   ```bash
   npx prisma db push
   npm run db:seed
   ```
5. Déployez. `next build` exécute automatiquement `prisma generate`.

## Structure du projet

```
prisma/schema.prisma        Schéma de base de données (miroir de db.sql + is_hero + admins)
prisma/seed.ts               Equipements, compte admin, véhicule d'exemple
src/app/                     Pages (Accueil, Inventaire, Fiche véhicule, Contact, Admin)
src/app/api/                 Routes API (leads, auth, admin CRUD véhicules, upload photos)
src/components/              Composants partagés (cartes véhicule, galerie, header/footer)
src/components/admin/        Formulaire véhicule, uploader multi-photos, checklist équipements
src/lib/                     Prisma client, auth, storage (Vercel Blob / local), requêtes véhicules
src/middleware.ts            Protection des routes /admin et /api/admin
```

## Notes

- Le champ `reference` (ex: `SA-2020-Q3`) est généré automatiquement si laissé vide à la
  création, mais reste modifiable et doit être unique.
- La règle des 15 à 20 photos est appliquée côté formulaire **et** côté API (`/api/admin/vehicles`)
  pour éviter tout contournement.
- Le statut "Vendu" retire le véhicule de la section "Arrivages Récents" de l'accueil mais reste
  visible/modifiable depuis l'admin.
