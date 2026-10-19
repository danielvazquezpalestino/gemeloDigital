# AGENTS.md — Gemelo Digital

Guía persistente para cualquier agente (o persona) que trabaje en este repositorio.
Si una instrucción de este archivo contradice a un pedido puntual, el pedido puntual manda; en caso de duda, preguntar.

---

## 1. Descripción del proyecto

API REST para el **Gemelo Digital** (base de datos `gemeloDigital`).
Expone endpoints de autenticación.

- **Raíz del backend:** `node/`
- **Raíz del repositorio (git):** la carpeta que contiene `node/`
- **Estado actual:** solo existe el módulo de autenticación (registro e inicio de sesión).

## 2. Stack

| Elemento | Tecnología |
|---|---|
| Runtime | Node.js 24 (ESM deshabilitado: `"type": "commonjs"`) |
| Lenguaje | TypeScript 5.9 (`module: nodenext`, `strict: true`) |
| Framework HTTP | Express 5.2 |
| Base de datos | MySQL 8 vía `mysql2` 3.24 (pool de conexiones) |
| Configuración | `dotenv` + `env-var` |
| Desarrollo | `ts-node-dev` (recarga en caliente), `rimraf` |

## 3. Arquitectura

Arquitectura **limpia / por capas** (Clean Architecture), con la regla de dependencia
apuntando **hacia adentro**: las capas externas dependen de las internas, nunca al revés.

```
┌─────────────────────────────────────────────────────────────┐
│  presentation/   HTTP: rutas, controladores, arranque       │  conoce Express
├─────────────────────────────────────────────────────────────┤
│  domain/         Entidades, DTOs, contratos (abstractos)   │  NO conoce Express
│                  y errores de negocio. Cero dependencias     │  ni MySQL
│                  externas.                                   │
├─────────────────────────────────────────────────────────────┤
│  infrastructure/ Implementaciones de los contratos:         │  conoce MySQL
│                  datasources, repositorios, pool de BD.      │
└─────────────────────────────────────────────────────────────┘
```

### 3.1 Capas y responsabilidades

| Capa | Carpeta | Responsabilidad | Puede importar |
|---|---|---|---|
| Presentación | `node/src/presentation/` | Exponer HTTP, traducir petición ↔ caso de uso, construir la respuesta | `domain`, `infrastructure` (solo para composición de rutas), Express |
| Dominio | `node/src/domain/` | Entidades, DTOs con validación, puertos (clases abstractas) y errores de negocio | Nada externo |
| Infraestructura | `node/src/infrastructure/` | Persistencia en MySQL, implementación de los puertos del dominio | `domain`, `mysql2` |
| Configuración | `node/src/config/` | Variables de entorno, pool de conexiones, validadores | `dotenv`, `env-var`, `mysql2` |

**Regla de dependencia:** `domain` no importa nada de `presentation` ni de `infrastructure`.
Los contratos (clases abstractas) viven en `domain`; sus implementaciones en `infrastructure`.
Si una clase de dominio necesita algo externo, se abstrae un puerto y se implementa afuera.

### 3.2 Capas de un módulo (patrón por módulo)

Cada módulo funcional (autenticación, inscripción, etc.) se reparte en tres capas,
con el **mismo nombre conceptual** en las tres:

```
domain/<contrato>.ts                  → clase abstracta (el "puerto")
infrastructure/<contrato>.impl.ts     → clase concreta (la "implementación")
presentation/<modulo>/controlador.ts  → manejo HTTP del módulo
```

Ejemplo con autenticación:

```
domain/repositorios/repositorio-autenticacion.ts
        (abstract) RepositorioAutenticacion
              ▲ implementa
infrastructure/repositorios/repositorio-autenticacion.impl.ts
        RepositorioAutenticacionImpl
              ▲ usa
infrastructure/fuentes-datos/fuente-datos-autenticacion.impl.ts
        FuenteDatosAutenticacionImpl
              ▲ implementa
domain/fuentes-datos/fuente-datos-autenticacion.ts
        (abstract) FuenteDatosAutenticacion
```

### 3.3 Flujo de una petición

```
Petición HTTP
   │
   ├─▶ presentation/rutas.ts                    RutasAplicacion        → monta /api/...
   │      └─▶ presentation/<módulo>/rutas.ts    Rutas<Modulo>          → declara método + ruta
   │             └─▶ presentation/<módulo>/controlador.ts
   │                    Controlador<Modulo>      → valida el DTO, invoca el puerto,
   │                                            │ mapea el resultado a la respuesta
   │                                            ▼
   │                  domain/repositorios/...    Repositorio<Modulo>    (puerto, abstracto)
   │                                            ▼
   │                  infrastructure/repositorios/...
   │                    Repositorio<Modulo>Impl  → orquesta la lógica de persistencia
   │                                            ▼
   │                  domain/fuentes-datos/...  FuenteDatos<Modulo>    (puerto, abstracto)
   │                                            ▼
   │                  infrastructure/fuentes-datos/...
   │                    FuenteDatos<Modulo>Impl  → ejecuta el SQL sobre MySQL
   │                                            ▼
   │                  config/base-datos.ts      pool de conexiones
   │
   └─▶ Respuesta JSON  ◀── controlador mapea entidad/error → { ... } o { "mensaje": "..." }
```

### 3.4 Árbol de directorios objetivo

Estructura **deseada** tras el refactor de §6. El árbol real en disco todavía usa los
nombres en inglés (`domain/`, `entities/`, `datasources/`, `presentation/`, `auth/`).

```
node/
├── src/
│   ├── app.ts                              punto de entrada
│   ├── .env                                variables de entorno (NO versionar)
│   ├── .env.example                        plantilla de variables (versionar)
│   ├── config/
│   │   ├── base-datos.ts                   pool de MySQL
│   │   └── entornos/                       carga y validación de variables
│   │       ├── entornos.ts
│   │       ├── validador.ts
│   │       └── index.ts
│   ├── domain/
│   │   ├── index.ts                        barril del dominio
│   │   ├── entidades/
│   │   │   ├── usuario.entidad.ts
│   │   │   └── dtos/autenticacion/registro-usuario.dto.ts
│   │   ├── repositorios/repositorio-autenticacion.ts
│   │   └── fuentes-datos/
│   │       ├── fuente-datos-autenticacion.ts
│   │       └── errores/error-personalizado.ts
│   ├── infrastructure/
│   │   ├── base-datos/index.ts             conexión al pool
│   │   ├── repositorios/repositorio-autenticacion.impl.ts
│   │   └── fuentes-datos/fuente-datos-autenticacion.impl.ts
│   └── presentation/
│       ├── servidor.ts                     clase Servidor (arranque Express)
│       ├── rutas.ts                        router raíz
│       └── autenticacion/
│           ├── rutas.ts
│           └── controlador.ts
├── package.json
└── tsconfig.json
```

### 3.5 Endpoints actuales

| Método | Ruta | Controlador | Estado |
|---|---|---|---|
| POST | `/api/Autenticacion/registro` | `ControladorAutenticacion.registrarUsuario` | Valida DTO y devuelve el usuario |
| POST | `/api/Autenticacion/inicio-sesion` | `ControladorAutenticacion.iniciarSesion` | **Pendiente de implementar** (devuelve mensaje fijo) |

## 4. Convenciones de código

### 4.1 Idioma — todo en español

**Todo el código, sin excepción**, va en español:

- Clases, métodos, propiedades, variables, parámetros, constantes.
- Nombres de archivos y carpetas.
- Claves de los objetos JSON de la API (p. ej. `mensaje` en vez de `error`).
- Valores de enumeraciones (p. ej. `ROL_ADMIN` en vez de `ADMIN_ROLE`).
- **Mensajes al usuario final**, respuestas de la API, y también `console.log`/`console.error`.
- Comentarios y documentación.

**Excepción obligatoria:** los identificadores técnicos de librerías y del runtime
(`express`, `req`, `res`, `next`, `Buffer`, `process`, `Promise`, etc.) se dejan
así porque son parte de una API pública ajena. El resto se traduce.

### 4.2 Nombrado

| Elemento | Convención | Ejemplo |
|---|---|---|
| Clases | PascalCase en español | `ControladorAutenticacion` |
| Interfaces y tipos | PascalCase en español | `UsuarioRegistrado` |
| Métodos y funciones | camelCase en español | `registrarUsuario` |
| Variables y parámetros | camelCase en español | `correoElectronico` |
| Propiedades privadas | `private` + camelCase en español | `private readonly repositorio` |
| Constantes | `UPPER_SNAKE_CASE` en español | `CODIGO_POR_DEFECTO` |
| Archivos y carpetas | `kebab-case` en español | `controlador-autenticacion.ts` |
| Interfaces de un solo método | `I` + PascalCase | `IRepositorio` |

> El **camelCase se mantiene**. Lo que cambia respecto al código actual es el
> **idioma** (inglés → español), no el estilo de mayúsculas.

### 4.3 Sin tildes ni `ñ` en los identificadores

Aunque TypeScript los admite, se prohíben en nombres de símbolos y archivos por
evitar problemas de codificación en herramientas, scripts y sistemas de archivos:

```ts
// ❌ incorrecto
const contraseña = "...";
class Autenticación {}

// ✅ correcto
const contrasenia = "...";
class Autenticacion {}
```

En **textos visibles al usuario** (mensajes de error, texto de la interfaz) las
tildes y la `ñ` sí se usan y son obligatorias.

### 4.4 Orientado a objetos

- Todo el comportamiento vive en **clases**. No hay funciones sueltas a nivel de módulo
  fuera de una clase, salvo *factory functions* mínimas y justificadas.
- Sin arrow functions sueltas en el nivel superior de un archivo; los handlers de
  Express se declaran como **métodos de instancia** (o arrow properties) de un controlador.
- **Inyección de dependencias por constructor**, sin instanciar dependencias dentro
  de la lógica de negocio.
- Visibilidad explícita: `private` / `protected` / `public`. No dejar propiedades públicas
  mutables.
- `readonly` en las propiedades que no cambian tras la construcción.
- `static` solo para fábricas y constantes (p. ej. `DtoRegistroUsuario.crear(...)`).
- Las clases de contrato del dominio son **abstractas**; las implementaciones viven en
  `infrastructure` y llevan el sufijo `Impl`.
- Los **DTOs son clases** con constructor `private` y un método estático `crear(...)`
  que valida la entrada y devuelve `[error, dto]`:

```ts
const [error, dto] = DtoRegistroUsuario.crear(req.body);
if (error) return res.status(400).json({ mensaje: error });
```

### 4.5 Persistencia

- **El SQL vive únicamente en `infrastructure/`.** `domain/` nunca escribe consultas.
- Consultas **parametrizadas** (`?` / `?`) — nunca concatenar valores en el string.
- Usar el pool de `config/base-datos.ts`; no abrir conexiones sueltas.
- Transacciones cuando una operación implique varias escrituras.

### 4.6 Errores y respuestas

- `ErrorPersonalizado` (en `domain`) es la jerarquía de errores de negocio:
  `peticionIncorrecta` (400), `noAutorizado` (401), `prohibido` (403),
  `noEncontrado` (404), `errorInterno` (500).
- **Nunca** devolver al cliente un stack trace ni el mensaje crudo de una excepción
  interna. El cliente recibe `{ "mensaje": "..." }` en español.
- Formato de error **único** en toda la API: `{ "mensaje": "Descripción en español" }`.
- Los `catch` deben registrar el error real en el servidor (`console.error`) antes de
  responder con un mensaje genérico.
- Debe existir un **manejador global de errores** y otro de **404**, ambos en JSON.
  (Pendiente: ver §6.)

### 4.7 Validación

- Validar **tipo y presencia** de cada campo, no solo su verdadiness. Un campo de texto
  debe comprobarse con `typeof valor === 'string'` antes de llamar a `.trim()`.
- Normalizar antes de validar (p. ej. `correo.trim().toLowerCase()`).
- Los identificadores que genera el servidor (id) **no se aceptan del cliente**:
  se generan en el servidor o los asigna la base de datos.
- Comprobar unicidad (p. ej. correo duplicado) antes de insertar.

### 4.8 Estilo de escritura

- 4 espacios de indentación.
- Llaves en la misma línea (`{`), punto y coma siempre.
- `import x = require('...')` — el proyecto es CommonJS; mantener ese estilo de importación.
- Rutas de importación **relativas**.
- Comentarios en español, explicando el *porqué*, no el *qué*.

## 5. Comandos

```bash
cd node

npm run dev     # servidor con recarga en caliente (ts-node-dev) en el puerto de .env
npm run build   # borra dist/ y compila con tsc
npm start       # build + node dist/app.js
```

**Verificación mínima antes de dar por terminado cualquier cambio:**

```bash
npx tsc --noEmit     # comprobación de tipos rápida
npm run build        # debe terminar con código 0
```

El arranque **requiere MySQL accesible**: `BaseDatos.conectar()` es una dependencia dura y,
si falla, el proceso termina con código 1. Para levantar el servidor sin MySQL,
usar las pruebas o montar las rutas en una app de Express aislada.

## 6. Estado actual: refactor pendiente

El código existente está escrito en **inglés** (clases, métodos, variables y mensajes).
**Debe refactorizarse al español** según §4. Esta es la lista de trabajo acordada:

### 6.1 Clases y símbolos

| Archivo actual | Archivo propuesto | Símbolo actual | Símbolo propuesto |
|---|---|---|---|
| `src/app.ts` | `src/app.ts` | `main` | `iniciar` |
| `src/presentation/server.ts` | `src/presentation/servidor.ts` | `Server`, `start` | `Servidor`, `iniciar` |
| `src/presentation/routes.ts` | `src/presentation/rutas.ts` | `AppRoutes` | `RutasAplicacion` |
| `src/presentation/auth/routes.ts` | `src/presentation/autenticacion/rutas.ts` | `AuthRoutes` | `RutasAutenticacion` |
| `src/presentation/auth/controller.ts` | `src/presentation/autenticacion/controlador.ts` | `AuthController` | `ControladorAutenticacion` |
| `src/presentation/auth/server.ts` | — (archivo vacío) | — | eliminar |
| `src/domain/entities/user.entities.ts` | `src/domain/entidades/usuario.entidad.ts` | `User` | `Usuario` |
| `src/domain/entities/dtos/auth/register-user.dtos.ts` | `src/domain/entidades/dtos/autenticacion/registro-usuario.dto.ts` | `registerUserDTO`, `create` | `DtoRegistroUsuario`, `crear` |
| `src/domain/repositories/auth.repository.ts` | `src/domain/repositorios/repositorio-autenticacion.ts` | `AuthRepository` | `RepositorioAutenticacion` |
| `src/domain/repositories/index.ts` | `src/domain/repositorios/index.ts` | `AuthRepository` | `RepositorioAutenticacion` |
| `src/domain/datasources/auth.datasource.ts` | `src/domain/fuentes-datos/fuente-datos-autenticacion.ts` | `AuthDatasource` | `FuenteDatosAutenticacion` |
| `src/domain/datasources/errors/custom.error.ts` | `src/domain/fuentes-datos/errores/error-personalizado.ts` | `CustomError` | `ErrorPersonalizado` |
| `src/domain/index.ts` | `src/domain/index.ts` | `domain` | `dominio` |
| `src/infrastructure/repositories/auth.repository.impl.ts` | `src/infrastructure/repositorios/repositorio-autenticacion.impl.ts` | `AuthRepositoryImpl` | `RepositorioAutenticacionImpl` |
| `src/infrastructure/datasources/auth.datasource.impl.ts` | `src/infrastructure/fuentes-datos/fuente-datos-autenticacion.impl.ts` | `AuthDatasourceImpl` | `FuenteDatosAutenticacionImpl` |
| `src/infrastructure/database/index.ts` | `src/infrastructure/base-datos/index.ts` | `Database`, `connect` | `BaseDatos`, `conectar` |
| `src/config/database.ts` | `src/config/base-datos.ts` | `pool` | `grupoConexiones` |
| `src/config/envs.ts/envs.ts` | `src/config/entornos/entornos.ts` | `envs` | `entornos` |
| `src/config/envs.ts/validator.ts` | `src/config/entornos/validador.ts` | `Validators` | `Validadores` |

### 6.2 Variables y parámetros

| Actual | Propuesto |
|---|---|
| `req`, `res` | `solicitud`, `respuesta` |
| `authController` | `controladorAutenticacion` |
| `authRepository` | `repositorioAutenticacion` |
| `authDatasource` | `fuenteDatosAutenticacion` |
| `dataSource` | `fuenteDatos` |
| `registerUserDto` | `dtoRegistroUsuario` |
| `registerUserDto` (parámetro) | `dtoRegistroUsuario` |
| `id` (propiedad) | `id` (se mantiene) |
| `name` | `nombre` |
| `email` | `correoElectronico` |
| `password` | `contrasenia` |
| `role` / `role[]` | `roles` |
| `img` | `imagen` |

### 6.3 Métodos

| Actual | Propuesto |
|---|---|
| `register` | `registrar` |
| `login` / `loginUser` | `iniciarSesion` |
| `create` (DTO) | `crear` |
| `start` | `iniciar` |
| `connect` | `conectar` |
| `badRequest` | `peticionIncorrecta` |
| `unauthorized` | `noAutorizado` |
| `forbidden` | `prohibido` |
| `notFound` | `noEncontrado` |
| `internalServer` | `errorInterno` |

### 6.4 Mensajes al usuario

| Actual | Propuesto |
|---|---|
| `Invalid user data` | `Datos de usuario inválidos` |
| `Invalid user name` | `Nombre de usuario inválido` |
| `Invalid user email` | `Correo electrónico inválido` |
| `Invalid user password` | `Contraseña inválida` |
| `Failed to register user` | `No se pudo registrar el usuario` |
| `Login successful` | `Sesión iniciada correctamente` |
| `Server started on port X` | `Servidor iniciado en el puerto X` |
| `Error conectando a MySQL` | `Error al conectar con MySQL` |
| Clave JSON `error` | Clave JSON `mensaje` |
| Valor `ADMIN_ROLE` | Valor `ROL_ADMIN` |

### 6.5 Pendientes de funcionalidad (fuera del alcance del renombrado)

Estos NO son renombrados; son trabajo de implementación pendiente:

1. **El registro no persiste en MySQL.** `FuenteDatosAutenticacionImpl.registrar` solo
   construye la entidad en memoria: no hay ninguna consulta SQL en el proyecto.
2. **El inicio de sesión no valida nada.** Devuelve un mensaje fijo sin comprobar credenciales.
3. **Las contraseñas no se cifran** y **se devuelven al cliente** dentro del JSON del usuario.
4. **No hay verificación de correo duplicado** ni generación de `id` en el servidor.
5. **Faltan manejador global de errores, 404 en JSON, CORS, cabeceras de seguridad y
   limitador de peticiones** en los endpoints de autenticación.
6. **No hay apagado ordenado**: el pool de MySQL nunca se cierra y no se atienden
   `SIGTERM`/`SIGINT`. El servidor tampoco captura errores de `listen` (p. ej. `EADDRINUSE`).

## 7. Cómo agregar un módulo nuevo

1. **Dominio:** entidad, DTO con `crear(...)` y validación, contrato abstracto del
   repositorio y del datasource, errores propios si hacen falta.
2. **Infraestructura:** implementaciones `Impl` de los contratos, con el SQL parametrizado.
3. **Presentación:** controlador con un método por endpoint y el archivo de rutas del módulo.
4. **Ensamblado:** registrar el router del módulo en `presentation/rutas.ts`.
5. **Verificar:** `npx tsc --noEmit` y `npm run build`.

El módulo no se considera terminado hasta que el endpoint persiste datos reales
en MySQL y responde con el formato JSON unificado de §4.6.

## 8. Git e higiene del repositorio

Estado actual y pendientes:

- **`.gitignore` ya existe** en `node/` con `node_modules/`, `dist/` y `.env`.
  `dist/`, `node_modules/` y `src/.env` **ya no están** en el índice de git.
- **`node/src/.env` no se versiona**; `node/src/.env.example` es la plantilla.
  Al agregar o renombrar una variable, actualizar **las dos**.
- **PENDIENTE — credencial filtrada.** La contraseña de MySQL estuvo versionada en los
  commits `755778b` y `882e80d` de un repositorio **público**
  (`github.com/danielvazquezpalestino/gemeloDigital`). Hay que **rotar la contraseña de
  MySQL**: limpiar el historial no basta, porque la credencial ya estuvo pública.
  Al rotarla, actualizar el `.env` de este proyecto **y** el de
  `C:\Users\Mario\Documents\GitHub\los-olivos-360` (también usa `DB_USER=root`).
- El remoto es `https://github.com/danielvazquezpalestino/gemeloDigital.git`
  (el repositorio se renombró; la carpeta local aún se llama `sitema-de-titulaci-n-`).
- No hay `README`, ni lint, ni tests, ni CI. El historial son 3 commits.
- No editar a mano lo que hay dentro de `dist/`: es salida de compilación y ya no
  está versionada.
