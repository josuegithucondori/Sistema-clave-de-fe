# =============================================
# Configuracion de GitHub Secrets para el despliegue
# Ejecutar: powershell -ExecutionPolicy Bypass -File setup-secrets.ps1
# =============================================

$ErrorActionPreference = "Stop"
$gh = "$env:LOCALAPPDATA\GitHubCLI\gh.exe"

if (!(Test-Path $gh)) {
    Write-Host "gh CLI no encontrado. Se configuraran los secretos usando el token de GitHub." -ForegroundColor Yellow
}

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  ACADEMIA CLAVE DE FE - CONFIGURACION DE DESPLIEGUE" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# === GITHUB TOKEN ===
$githubToken = Read-Host "Token de GitHub (Personal Access Token)"
if (-not $githubToken) { Throw "Token requerido" }

# === SUPABASE ===
Write-Host "" -ForegroundColor Cyan
Write-Host "1) SUPABASE" -ForegroundColor Green
Write-Host "   Crea el proyecto en https://supabase.com con el esquema de supabase/schema.sql" -ForegroundColor Yellow
$supabaseUrl = Read-Host "Supabase Project URL (ej: https://xyz.supabase.co)"
$supabaseKey = Read-Host "Supabase anon public key (empieza con eyJ...)"

# === CLOUDFLARE ===
Write-Host ""
Write-Host "2) CLOUDFLARE" -ForegroundColor Green
Write-Host "   Crea un API Token en: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Yellow
Write-Host "   Con permisos: Account.Cloudflare Pages - Edit, Zone.Workers Scripts - Edit" -ForegroundColor Yellow
$cfToken = Read-Host "Cloudflare API Token"
$accountId = Read-Host "Cloudflare Account ID"

# Guardar .env.local
@"
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseKey
"@ | Out-File -FilePath ".env.local" -Encoding utf8

Write-Host ""
Write-Host "Archivo .env.local actualizado" -ForegroundColor Green

# Crear secretos de GitHub
$repo = "josuegithucondori/Sistema-clave-de-fe"

Write-Host ""
Write-Host "Configurando secretos en GitHub..."
$url = "https://api.github.com/repos/$repo/actions/secrets"

$secrets = @{
    "NEXT_PUBLIC_SUPABASE_URL" = $supabaseUrl
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = $supabaseKey
    "CLOUDFLARE_API_TOKEN" = $cfToken
    "CLOUDFLARE_ACCOUNT_ID" = $accountId
}

foreach ($key in $secrets.Keys) {
    $body = @{ name = $key; value = $secrets[$key] } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "$url/$key" `
            -Method Put `
            -Headers @{ Authorization = "token $githubToken"; Accept = "application/vnd.github+json" } `
            -ContentType "application/json" `
            -Body $body | Out-Null
        Write-Host "  Secret $key configurado" -ForegroundColor Green
    } catch {
        $bodyUpdate = @{ encrypted_value = $secrets[$key] } | ConvertTo-Json
        try {
            Invoke-RestMethod -Uri "$url/$key" `
                -Method Patch `
                -Headers @{ Authorization = "token $githubToken"; Accept = "application/vnd.github+json" } `
                -ContentType "application/json" `
                -Body $bodyUpdate | Out-Null
            Write-Host "  Secret $key actualizado" -ForegroundColor Green
        } catch {
            Write-Host "  Error al configurar $key : $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  TODO LISTO: el proximo 'git push' a main dispara el"
Write-Host "  despliegue automatico en Cloudflare Pages via CI/CD"
Write-Host "=====================================================" -ForegroundColor Cyan