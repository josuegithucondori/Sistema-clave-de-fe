# Academia Clave de Fe

Sistema de administracion academica con **Next.js 15**, **Supabase** (base de datos) y **Cloudflare Pages** (hosting).

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

## PASO 2: Configurar las Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU-ANON-KEY-AQUI
```

---

## PASO 3: Desarrollo Local

```bash
npm install
npm run dev
```

Abre http://localhost:3000 y usa:
- Email: `admin@clavede-fe.com`
- Password: `admin123`

---

## PASO 4: Desplegar en Cloudflare Pages

### Opción A: Desde GitHub (recomendado)

1. Sube el código a GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: sistema academia clave de fe"
   git remote add origin https://github.com/TU-USUARIO/Sistema-clave-de-fe.git
   git push -u origin main
   ```

2. Ve a [https://dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create**

3. Conecta tu repositorio de GitHub

4. Configura el build:
   - **Framework preset:** Next.js
   - **Build command:** `npm run cloudflare:build`
   - **Build output directory:** `.open-next`
   - **Node.js version:** 18 o 20

5. Agrega las variables de entorno en **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` → tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → tu anon key

6. Click **Save and Deploy**

### Opción B: Desde tu PC con Wrangler

```bash
npm install
npx wrangler login
npm run deploy
```

---

## PASO 5: Configurar Secrets de Cloudflare (si aplica)

```bash
npx wrangler pages secret put NEXT_PUBLIC_SUPABASE_URL --project-name academia-clave-de-fe
npx wrangler pages secret put NEXT_PUBLIC_SUPABASE_ANON_KEY --project-name academia-clave-de-fe
```

---

## Estructura del Proyecto

```
academia-clave-de-fe/
├── supabase/
│   └── schema.sql          # Esquema de la base de datos
├── src/
│   ├── app/
│   │   ├── page.tsx         # Login
│   │   ├── layout.tsx       # Root layout
│   │   ├── globals.css      # Estilos globales
│   │   └── dashboard/
│   │       ├── layout.tsx   # Layout con sidebar
│   │       ├── page.tsx     # Dashboard principal
│   │       ├── docentes/    # CRUD Docentes
│   │       ├── alumnos/     # CRUD Alumnos
│   │       ├── aulas/       # CRUD Aulas
│   │       └── horarios/    # CRUD Horarios
│   ├── lib/
│   │   └── supabase.ts      # Cliente Supabase
│   ├── middleware.ts         # Protección de rutas
│   └── types/
│       └── index.ts         # Tipos TypeScript
├── open-next.config.ts      # Config OpenNext (Cloudflare)
├── wrangler.jsonc           # Config Cloudflare Workers
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Licencia

MIT