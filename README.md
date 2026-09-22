# Academia Clave de Fe

Sistema de administracion academica con **Next.js 15**, **Supabase** (base de datos) y **Cloudflare Pages** (hosting), desplegado automaticamente con **GitHub Actions**.

## Funcionalidades
- Gestión de **Docentes** (CRUD)
- Gestión de **Alumnos** (CRUD)
- Gestión de **Aulas** (CRUD)
- Gestión de **Horarios** con vista por día
- Dashboard principal con estadísticas y horarios del día
- Autenticación con Supabase Auth
- Panel protegido por middleware

## Tecnologías
- **Frontend:** Next.js 15 (App Router) + Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL)
- **Hosting:** Cloudflare Pages
- **CI/CD:** GitHub Actions (deploy automatico en cada push a main)

---

## Guardar Token de GitHub (opcional pero recomendado)

Por seguridad, el token que compartiste ya fue usado. **Revócalo** en:
https://github.com/settings/tokens

---

## PASO 1: Configurar Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Click en **"New Project"**:
   - Organization: crea una nueva
   - Database password: elige una contraseña
   - Region: selecciona la más cercana
3. Una vez creado el proyecto, ve a **SQL Editor** (menú izquierdo)
4. Abre el archivo `supabase/schema.sql` de este repo, cópialo y pégalo en el SQL Editor
5. Click en **"Run"** para crear todas las tablas
6. Ve a **Authentication → Users** y crea un usuario:
   - Email: `admin@clavede-fe.com`
   - Password: `admin123`
7. Ve a **Settings → API** y copia:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - **Anon public key** (empieza con `eyJ...`)

---

## PASO 2: Configurar Cloudflare

1. Ve a [https://dash.cloudflare.com](https://dash.cloudflare.com) y crea una cuenta gratuita
2. Ve a **My Profile → API Tokens → Create Token**
3. Usa la plantilla **"Edit Cloudflare Workers"** (o create uno Custom con permisos):
   - `Account - Cloudflare Pages - Edit`
   - `Account - Workers Scripts - Edit`
   - `Account - Account Settings - Read`
4. Copia el **API Token** generado
5. En el dashboard, tu **Account ID** está en la pagina principal

---

## PASO 3: Configurar los GitHub Secrets

Ejecuta el script (responde las preguntas):

```powershell
powershell -ExecutionPolicy Bypass -File setup-secrets.ps1
```

O configura los 4 secretos manualmente en:
**GitHub → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valor |
|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tu Project URL de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu anon key de Supabase |
| `CLOUDFLARE_API_TOKEN` | Tu API token de Cloudflare |
| `CLOUDFLARE_ACCOUNT_ID` | Tu Account ID de Cloudflare |

---

## PASO 4: Desplegar (automatico)

El workflow en `.github/workflows/cloudflare-deploy.yml` se ejecuta en cada `git push` a la rama `main`:

```bash
git add .
git commit -m "deploy"
git push origin main
```

GitHub Actions compilara el proyecto (Next.js + OpenNext) y lo desplegara en Cloudflare Pages.

---

## Desarrollo Local

```bash
npm install
npm run dev
```

Abre http://localhost:3000 y usa:
- Email: `admin@clavede-fe.com`
- Password: `admin123`

---

## Estructura del Proyecto

```
academia-clave-de-fe/
├── .github/workflows/
│   └── cloudflare-deploy.yml    # CI/CD para Cloudflare Pages
├── supabase/
│   └── schema.sql              # Esquema de la base de datos
├── src/
│   ├── app/
│   │   ├── page.tsx             # Login
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Estilos globales
│   │   └── dashboard/
│   │       ├── layout.tsx       # Layout con sidebar
│   │       ├── page.tsx         # Dashboard principal
│   │       ├── docentes/        # CRUD Docentes
│   │       ├── alumnos/         # CRUD Alumnos
│   │       ├── aulas/           # CRUD Aulas
│   │       └── horarios/        # CRUD Horarios
│   ├── lib/
│   │   └── supabase.ts          # Cliente Supabase
│   ├── middleware.ts            # Protección de rutas
│   └── types/
│       └── index.ts             # Tipos TypeScript
├── open-next.config.ts          # Config OpenNext (Cloudflare)
├── wrangler.jsonc               # Config Cloudflare Workers
├── setup-secrets.ps1            # Configura secretos de GitHub
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Licencia

MIT