{
  "name": "Academia Clave de Fe",
  "version": "1.0.0",
  "description": "Sistema de administracion academica para la Academia Clave de Fe - Docentes, Alumnos, Aulas y Horarios",
  "homepage": "https://github.com/josuegithucondori/Sistema-clave-de-fe",
  "scripts": {
    "setup:supabase": "supabase init && supabase db push",
    "deploy:cloudflare": "npx @cloudflare/next-on-pages && npx wrangler pages deploy .vercel/output/static",
    "deploy:all": "npm run build && npm run deploy:cloudflare"
  },
  "keywords": ["academia", "educacion", "nextjs", "supabase", "cloudflare"],
  "license": "MIT"
}