# 📘 API Documentation — Portfolio Backend

## Informations générales

| Propriété | Valeur |
|-----------|--------|
| **Base URL (dev)** | `http://localhost:3000` |
| **Format** | JSON pour toutes les réponses |
| **Upload fichiers** | `multipart/form-data` |
| **Images statiques** | `http://localhost:3000/uploads/<nom_du_fichier>` |
| **CORS** | Toutes origines autorisées |
| **Authentification** | Aucune |

---

## Modèle de données — `Project`

```ts
interface Project {
  id: number;
  coverImage: string;        // chemin relatif ex: "uploads/coverImage-xxx.png"
  title: string;
  description: string;
  technologies: string[];    // ex: ["React", "Node.js", "PostgreSQL"]
  client: string;
  date: string;              // format ISO "YYYY-MM-DD"
  category: "projet-dev" | "projet-design";
  type: "maquette" | "affiche" | "frontend" | "backend" | "fullstack" | "mobile" | "desktop";
  link: string;              // URL du projet ou lien de téléchargement
  screenshots: string[];     // tableau de chemins relatifs
  createdAt: string;         // ISO datetime
  updatedAt: string;         // ISO datetime
}
```

---

## Modèle de données — `Skill`

```ts
interface Skill {
  id: number;
  name: string;                       // ex: "React", "Figma"
  level: number;                      // niveau de maîtrise 0 → 100
  category: "dev" | "design";
  type:
    | "langage-de-programmation"      // catégorie dev
    | "framework"                     // catégorie dev
    | "base-de-donnee"               // catégorie dev
    | "outil"                         // catégorie dev
    | "prototypage"                   // catégorie design
    | "design"                        // catégorie design
    | "3d";                           // catégorie design
  createdAt: string;
  updatedAt: string;
}
```

### Correspondance category → types valides

| `category` | `type` autorisés |
|------------|-----------------|
| `"dev"` | `langage-de-programmation`, `framework`, `base-de-donnee`, `outil` |
| `"design"` | `prototypage`, `design`, `3d` |

---

## Modèle de données — `CV`

```ts
interface CV {
  id: number;
  filePath: string;       // chemin relatif ex: "uploads/cv/cv-xxx.pdf"
  originalName: string;   // nom original du fichier uploadé
  createdAt: string;
  updatedAt: string;
}
```

> ⚠️ Il n'y a **qu'un seul CV** en base à la fois. Un `POST /api/cv` remplace automatiquement l'ancien.

---

### Valeurs des enums

**`category`**
- `"projet-dev"` → Projets de développement
- `"projet-design"` → Projets de design

**`type`** (selon la catégorie)
- Design → `"maquette"` | `"affiche"`
- Dev → `"frontend"` | `"backend"` | `"fullstack"` | `"mobile"` | `"desktop"`

---

## Construction des URLs d'images

Les chemins retournés par l'API (ex: `"uploads/coverImage-xxx.png"`) doivent être
préfixés par la base URL pour afficher les images :

```ts
const BASE_URL = "http://localhost:3000";

const imageUrl = `${BASE_URL}/${project.coverImage}`;
// → http://localhost:3000/uploads/coverImage-1234567890.png

const screenshotUrls = project.screenshots.map(s => `${BASE_URL}/${s}`);
```

---

## Format des réponses

### ✅ Succès — liste
```json
{
  "success": true,
  "count": 2,
  "data": [ /* tableau de Project */ ]
}
```

### ✅ Succès — objet unique
```json
{
  "success": true,
  "data": { /* objet Project */ }
}
```

### ✅ Succès — suppression
```json
{
  "success": true,
  "message": "Projet supprimé avec succès"
}
```

### ❌ Erreur — validation
```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": ["Le titre est requis", "La catégorie doit être ..."]
}
```

### ❌ Erreur — non trouvé
```json
{
  "success": false,
  "message": "Projet non trouvé"
}
```

### ❌ Erreur — serveur
```json
{
  "success": false,
  "message": "Erreur interne du serveur"
}
```

---

## Endpoints

### 1. `GET /api/health`
Vérifie que l'API est en ligne.

**Réponse**
```json
{ "success": true, "message": "API Portfolio opérationnelle 🚀" }
```

---

### 2. `GET /api/projects`
Récupère tous les projets, triés par date décroissante.

**Query params optionnels**
| Param | Type | Exemple |
|-------|------|---------|
| `category` | string | `?category=projet-dev` |
| `type` | string | `?type=fullstack` |

**Exemples**
```
GET /api/projects
GET /api/projects?category=projet-dev
GET /api/projects?category=projet-design&type=maquette
```

**Réponse 200**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "coverImage": "uploads/coverImage-1234567890-123.png",
      "title": "Mon app e-commerce",
      "description": "Une application fullstack avec panier et paiement",
      "technologies": ["React", "Node.js", "PostgreSQL"],
      "client": "Client ABC",
      "date": "2025-06-15",
      "category": "projet-dev",
      "type": "fullstack",
      "link": "https://monprojet.com",
      "screenshots": [
        "uploads/screenshots-1234567890-456.png",
        "uploads/screenshots-1234567890-789.png"
      ],
      "createdAt": "2026-03-16T21:01:56.791Z",
      "updatedAt": "2026-03-16T21:01:56.791Z"
    }
  ]
}
```

---

### 3. `GET /api/projects/:id`
Récupère un projet par son ID.

**Réponse 200**
```json
{
  "success": true,
  "data": { /* objet Project */ }
}
```

**Réponse 404**
```json
{ "success": false, "message": "Projet non trouvé" }
```

---

### 4. `POST /api/projects`
Crée un nouveau projet.

> ⚠️ **Content-Type : `multipart/form-data`** (obligatoire pour l'upload des images)

**Champs du formulaire**

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `coverImage` | File (image) | ✅ | Photo de couverture |
| `title` | string | ✅ | Titre du projet |
| `description` | string | ✅ | Description du projet |
| `category` | string (enum) | ✅ | `"projet-dev"` ou `"projet-design"` |
| `type` | string (enum) | ✅ | Voir valeurs des enums |
| `technologies` | string (JSON array) | ❌ | `'["React","Node.js"]'` |
| `client` | string | ❌ | Nom du client |
| `date` | string | ❌ | Format `"YYYY-MM-DD"` |
| `link` | string | ❌ | URL du projet |
| `screenshots` | File[] (images) | ❌ | Captures d'écran (max 10) |

**Exemple avec `fetch`**
```js
const formData = new FormData();
formData.append("coverImage", coverImageFile);       // File object
formData.append("title", "Mon app e-commerce");
formData.append("description", "Une application...");
formData.append("technologies", JSON.stringify(["React", "Node.js", "PostgreSQL"]));
formData.append("client", "Client ABC");
formData.append("date", "2025-06-15");
formData.append("category", "projet-dev");
formData.append("type", "fullstack");
formData.append("link", "https://monprojet.com");
screenshots.forEach(file => formData.append("screenshots", file)); // plusieurs fichiers

const res = await fetch("http://localhost:3000/api/projects", {
  method: "POST",
  body: formData,
  // Ne PAS mettre Content-Type manuellement, fetch le gère avec le boundary
});
const data = await res.json();
```

**Exemple avec `axios`**
```js
const formData = new FormData();
formData.append("coverImage", coverImageFile);
formData.append("title", "Mon app e-commerce");
formData.append("technologies", JSON.stringify(["React", "Node.js"]));
formData.append("category", "projet-dev");
formData.append("type", "fullstack");
formData.append("description", "Une application...");

const { data } = await axios.post("http://localhost:3000/api/projects", formData);
// axios gère automatiquement le Content-Type multipart/form-data
```

**Réponse 201**
```json
{
  "success": true,
  "data": { /* objet Project créé */ }
}
```

---

### 5. `PUT /api/projects/:id`
Met à jour un projet existant. **Tous les champs sont optionnels** (mise à jour partielle).

> ⚠️ Si tu envoies de nouvelles images, utilise `multipart/form-data`.
> Si tu n'envoies que du texte, tu peux utiliser `application/json`.

**Mise à jour texte uniquement (`application/json`)**
```js
const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Nouveau titre",
    link: "https://nouveau-lien.com",
    technologies: ["Vue.js", "Laravel"],
  }),
});
```

**Mise à jour avec nouvelles images (`multipart/form-data`)**
```js
const formData = new FormData();
formData.append("title", "Nouveau titre");
formData.append("coverImage", newCoverFile);          // remplace l'ancienne (efface le fichier)
newScreenshots.forEach(f => formData.append("screenshots", f)); // remplace toutes les anciennes

const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
  method: "PUT",
  body: formData,
});
```

**Réponse 200**
```json
{
  "success": true,
  "data": { /* objet Project mis à jour */ }
}
```

---

### 6. `DELETE /api/projects/:id`
Supprime un projet et **efface automatiquement** les fichiers images associés du serveur.

```js
const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
  method: "DELETE",
});
const data = await res.json();
```

**Réponse 200**
```json
{ "success": true, "message": "Projet supprimé avec succès" }
```

**Réponse 404**
```json
{ "success": false, "message": "Projet non trouvé" }
```

---

## Limites & contraintes

| Règle | Valeur |
|-------|--------|
| Taille max par image (projet) | **5 Mo** |
| Formats images acceptés | `image/jpeg`, `image/png`, `image/webp`, `image/gif` |
| Nombre max de screenshots | **10** |
| Taille max CV | **10 Mo** |
| Format CV accepté | `application/pdf` |
| Nombre de CV en base | **1** (le nouveau remplace l'ancien) |

---

## Endpoints — Compétences

### 7. `GET /api/skills`
Récupère toutes les compétences, triées par niveau décroissant.

**Query params optionnels**
| Param | Type | Exemple |
|-------|------|---------|
| `category` | string | `?category=dev` |
| `type` | string | `?type=framework` |

**Exemples**
```
GET /api/skills
GET /api/skills?category=dev
GET /api/skills?category=design&type=prototypage
```

**Réponse 200**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "React",
      "level": 90,
      "category": "dev",
      "type": "framework",
      "createdAt": "2026-03-16T21:00:00.000Z",
      "updatedAt": "2026-03-16T21:00:00.000Z"
    }
  ]
}
```

---

### 8. `GET /api/skills/:id`
Récupère une compétence par ID.

---

### 9. `POST /api/skills`
Crée une nouvelle compétence. **`Content-Type: application/json`**

**Body JSON**

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `name` | string | ✅ | Nom de la compétence |
| `level` | number | ✅ | Niveau 0 → 100 |
| `category` | string (enum) | ✅ | `"dev"` ou `"design"` |
| `type` | string (enum) | ✅ | Voir tableau correspondance |

**Exemple avec `fetch`**
```js
const res = await fetch("http://localhost:3000/api/skills", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "React",
    level: 90,
    category: "dev",
    type: "framework",
  }),
});
const data = await res.json();
```

**Réponse 201**
```json
{
  "success": true,
  "data": { /* objet Skill créé */ }
}
```

---

### 10. `PUT /api/skills/:id`
Met à jour une compétence. **Tous les champs sont optionnels.** `Content-Type: application/json`

```js
const res = await fetch(`http://localhost:3000/api/skills/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ level: 95 }),
});
```

---

### 11. `DELETE /api/skills/:id`
Supprime une compétence.

---

## Endpoints — CV

### 12. `GET /api/cv`
Récupère les informations du CV actuel.

**Réponse 200**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filePath": "uploads/cv/cv-1234567890.pdf",
    "originalName": "mon-cv.pdf",
    "createdAt": "2026-03-16T21:00:00.000Z",
    "updatedAt": "2026-03-16T21:00:00.000Z"
  }
}
```

**Réponse 404** (aucun CV uploadé)
```json
{ "success": false, "message": "Aucun CV disponible" }
```

> 💡 Pour afficher/télécharger le PDF :
> ```js
> const BASE_URL = "http://localhost:3000";
> const cvUrl = `${BASE_URL}/${cv.filePath}`;
> // → http://localhost:3000/uploads/cv/cv-1234567890.pdf
> ```

---

### 13. `POST /api/cv`
Upload ou remplace le CV. **Content-Type : `multipart/form-data`**

> ⚠️ Si un CV existe déjà, il est **automatiquement supprimé** et remplacé.

**Champ du formulaire**
| Champ | Type | Requis |
|-------|------|--------|
| `cv` | File (PDF) | ✅ |

**Exemple avec `fetch`**
```js
const formData = new FormData();
formData.append("cv", pdfFile); // File object .pdf

const res = await fetch("http://localhost:3000/api/cv", {
  method: "POST",
  body: formData,
  // Ne PAS mettre Content-Type manuellement
});
const data = await res.json();
```

**Réponse 201** (premier upload)
```json
{ "success": true, "data": { /* objet CV */ } }
```

**Réponse 200** (remplacement)
```json
{ "success": true, "data": { /* objet CV mis à jour */ } }
```

---

### 14. `DELETE /api/cv`
Supprime le CV (fichier + enregistrement en base).

**Réponse 200**
```json
{ "success": true, "message": "CV supprimé avec succès" }
```

---

## Gestion des erreurs côté frontend

```js
const apiCall = async (url, options = {}) => {
  const res = await fetch(url, options);
  const data = await res.json();

  if (!data.success) {
    // Afficher data.message et/ou data.errors[]
    throw new Error(data.errors?.join(", ") || data.message);
  }

  return data;
};
```

---

## Variables d'environnement frontend recommandées

```env
# .env (React / Vue / Next.js)
VITE_API_URL=http://localhost:3000        # Vite
NEXT_PUBLIC_API_URL=http://localhost:3000 # Next.js
REACT_APP_API_URL=http://localhost:3000   # CRA
```

```js
// Usage
const BASE_URL = import.meta.env.VITE_API_URL; // Vite
const imageUrl = `${BASE_URL}/${project.coverImage}`;
```

