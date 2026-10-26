Cómo probarlo
# Terminal 1 (MySQL encendido)
cd node
npm run dev

# Terminal 2
cd gemeloDigital
npm start
Primero crea un usuario (o usa Swagger en http://localhost:3100/api-docs):
Invoke-RestMethod -Method Post -Uri http://localhost:3100/api/Auth/register `
  -ContentType 'application/json' `
  -Body '{"nombre":"Tu Nombre","correo":"tu@correo.com","contrasenia":"TuClaveSegura"}'
Luego entra a http://localhost:4200 (redirige a /iniciar-sesion).
Notas
- No hice commit: gemeloDigital/, AGENTSANGULAR.md y los archivos nuevos del backend siguen sin trackear. Si quieres, los agrupo en commits.
- El token se emite, pero la API aún no lo verifica en un middleware ni protege endpoints (lo dejé anotado en AGENTS.md §6.5).
- No hay pantalla de registro; solo se pidió el inicio de sesión. El registro está disponible por API/Swagger.
- npm audit reporta una vulnerabilidad alta preexistente en body-parser (transitiva de Express), ajena a este cambio; se puede corregir con npm audit fix si quieres.