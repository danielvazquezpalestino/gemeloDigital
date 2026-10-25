# Catálogo de Paneles Solares — Módulo del Gemelo Digital

## Descripción

Módulo de la API que expone el **catálogo de paneles solares** y permite
filtrarlo por fabricante y por potencia mínima.

El módulo respeta la arquitectura limpia por capas:

- El **dominio** contiene la entidad `PanelSolar`, el DTO `DtoFiltrarPaneles` y
  los contratos del repositorio y de la fuente de datos.
- La **infraestructura** intenta leer la tabla `paneles_solares` de MySQL y, si
  no hay registros, la tabla no existe o la consulta falla, devuelve el
  **catálogo formal en memoria**.
- La **presentación** valida los parámetros, invoca el repositorio y traduce los
  errores a `CustomError` con el formato único `{ "mensaje": "..." }`.

> **Aviso:** los fabricantes y modelos del catálogo son **FICTICIOS**. Son datos
> de DEMOSTRACIÓN y no representan productos reales verificados.

## Método y rutas

| Método | Ruta | Controlador | Método del controlador | Estado |
|---|---|---|---|---|
| GET | `/api/v1/panels` | `ControladorPaneles` | `listarPaneles` | Implementado |

## Autenticación

No requerida.

---

## 1. GET /api/v1/panels — Consultar el catálogo de paneles

Devuelve los paneles disponibles, opcionalmente filtrados por fabricante y por
potencia mínima. La fuente de datos intenta consultar MySQL primero.

### Parámetros de consulta

| Parámetro | Tipo | Obligatorio | Restricciones | Descripción |
|---|---|---|---|---|
| `fabricante` | texto | No | Máximo 80 caracteres | Filtra por fabricante. La coincidencia es parcial y no distingue mayúsculas |
| `potenciaMinimaWatts` | número | No | > 0 y ≤ 100 000 | Devuelve los paneles con potencia mayor o igual al valor |

Los parámetros son independientes y se pueden combinar. Si no se envía ninguno,
se devuelve el catálogo completo.

### Ejemplo — catálogo completo

```
GET /api/v1/panels
```

### Ejemplo — filtrar por fabricante

```
GET /api/v1/panels?fabricante=Demo%20Uno
```

### Ejemplo — filtrar por potencia mínima

```
GET /api/v1/panels?potenciaMinimaWatts=500
```

### Ejemplo — filtros combinados

```
GET /api/v1/panels?fabricante=Demo%20Uno&potenciaMinimaWatts=500
```

### Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Paneles obtenidos correctamente",
    "esDemostracion": true,
    "advertencia": "El catálogo contiene fabricantes y modelos FICTICIOS de demostración.",
    "paneles": [
        {
            "id": "DEMO-PANEL-003",
            "fabricante": "Fabricante Demo Dos",
            "modelo": "FDD-400P",
            "potenciaWatts": 400,
            "eficienciaPorcentaje": 19.2,
            "tecnologia": "Policristalino",
            "garantiaAnios": 10,
            "anchoMetros": 1.05,
            "altoMetros": 1.95,
            "descripcion": "Panel de demostración de tecnología policristalina.",
            "esDemostracion": true
        },
        {
            "id": "DEMO-PANEL-001",
            "fabricante": "Fabricante Demo Uno",
            "modelo": "FD-450M",
            "potenciaWatts": 450,
            "eficienciaPorcentaje": 20.5,
            "tecnologia": "Monocristalino",
            "garantiaAnios": 12,
            "anchoMetros": 1.13,
            "altoMetros": 1.76,
            "descripcion": "Panel de demostración para pruebas del gemelo digital.",
            "esDemostracion": true
        },
        {
            "id": "DEMO-PANEL-002",
            "fabricante": "Fabricante Demo Uno",
            "modelo": "FD-550M",
            "potenciaWatts": 550,
            "eficienciaPorcentaje": 21.3,
            "tecnologia": "Monocristalino",
            "garantiaAnios": 12,
            "anchoMetros": 1.13,
            "altoMetros": 2.09,
            "descripcion": "Panel de demostración de mayor potencia.",
            "esDemostracion": true
        }
    ]
}
```

Los resultados se ordenan de menor a mayor potencia y, en caso de empate, por
`id`.

### Campos del panel

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | texto | Identificador del panel en el catálogo |
| `fabricante` | texto | Fabricante del panel |
| `modelo` | texto | Modelo comercial |
| `potenciaWatts` | número | Potencia nominal en watts |
| `eficienciaPorcentaje` | número | Eficiencia de conversión en porcentaje |
| `tecnologia` | texto | Tecnología del panel |
| `garantiaAnios` | número | Años de garantía del fabricante |
| `anchoMetros` | número | Ancho del panel en metros |
| `altoMetros` | número | Alto del panel en metros |
| `descripcion` | texto | Descripción del panel |
| `esDemostracion` | booleano | Indica si el registro es de demostración |

### Comportamiento del fallback

| Situación | Resultado |
|---|---|
| MySQL tiene registros que coinciden con el filtro | Se devuelven esos registros |
| MySQL tiene registros, pero ninguno coincide con el filtro | `paneles: []` |
| La tabla `paneles_solares` está vacía | Se usa el catálogo formal en memoria y se aplican los mismos filtros |
| La tabla no existe o la consulta falla | Se usa el catálogo formal en memoria y se aplican los mismos filtros |

> El fallback no cambia el contrato del repositorio: `listar(filtros)` sigue
> devolviendo `PanelSolar[]`. La decisión de usar MySQL o el catálogo en memoria
> vive únicamente en la fuente de datos.

---

## Modelo de filtrado

No hay cálculos eléctricos en este módulo: el único procesamiento es el filtrado
del catálogo.

### Reglas

```
fabricante         = coincidencia parcial, sin distinguir mayúsculas
potencia mínima    = potenciaWatts >= potenciaMinimaWatts
orden              = potenciaWatts ASC, id ASC
```

### Implementación en MySQL

La consulta se construye con marcadores de posición y filtros opcionales:

```sql
SELECT id, fabricante, modelo, potencia_watts, eficiencia_porcentaje,
       tecnologia, garantia_anios, ancho_metros, alto_metros,
       descripcion, es_demostracion
FROM paneles_solares
WHERE fabricante LIKE ?
  AND potencia_watts >= ?
ORDER BY potencia_watts ASC, id ASC;
```

Los valores se envían como parámetros al pool de MySQL. El filtro por
fabricante usa `LIKE` con comodines alrededor del texto, por lo que la
coincidencia es parcial.

### Implementación en memoria

El catálogo de respaldo aplica las mismas reglas con `includes` sobre el
fabricante en minúsculas y una comparación numérica de potencia.

---

## Códigos de respuesta

| Código | Cuerpo | Descripción |
|---|---|---|
| 200 | `{ "mensaje": "...", "paneles": [...] }` | Consulta correcta, incluso si no hay coincidencias |
| 400 | `{ "mensaje": "..." }` | Parámetros inválidos. Se lanza como `CustomError.badRequest(...)` |
| 500 | `{ "mensaje": "..." }` | Error interno. El detalle real solo se registra en el servidor con `console.error` |

Ejemplos de errores `400`:

```json
{ "mensaje": "El campo \"potenciaMinimaWatts\" debe ser un número válido" }
```

```json
{ "mensaje": "El campo \"potenciaMinimaWatts\" debe ser mayor que 0" }
```

```json
{ "mensaje": "El campo \"potenciaMinimaWatts\" no puede ser mayor que 100000" }
```

```json
{ "mensaje": "El campo \"fabricante\" no puede superar 80 caracteres" }
```

```json
{ "mensaje": "El campo \"fabricante\" debe ser un texto" }
```

---

## Arquitectura (capas y archivos)

```
Petición HTTP
   │
   ├─▶ presentation/routes.ts                       AppRoutes              → monta /api/v1
   │      └─▶ presentation/rutas-v1.ts              RutasV1                → monta /panels
   │             └─▶ presentation/paneles/rutas.ts
   │                    RutasPaneles                → declara método + ruta
   │                    └─▶ presentation/paneles/controlador.ts
   │                           ControladorPaneles    → valida el DTO, invoca el puerto,
   │                                                 │ mapea el resultado a la respuesta
   │                                                 ▼
   │                  domain/repositories/repositorio-paneles.ts
   │                    RepositorioPaneles            (puerto, abstracto)
   │                                                 ▼
   │                  infrastructure/repositories/repositorio-paneles.impl.ts
   │                    RepositorioPanelesImpl        → delega en la fuente de datos
   │                                                 ▼
   │                  domain/datasources/fuente-datos-paneles.ts
   │                    FuenteDatosPaneles            (puerto, abstracto)
   │                                                 ▼
   │                  infrastructure/datasources/fuente-datos-paneles.impl.ts
   │                    FuenteDatosPanelesImpl        → consulta MySQL y aplica fallback
   │                                                 ▼
   │                  config/database.ts               pool de conexiones MySQL
   │
   └─▶ Respuesta JSON  ◀── controlador mapea entidad/error → { ... } o { "mensaje": "..." }
```

| Capa | Archivo | Símbolo |
|---|---|---|
| Dominio (entidad) | `node/src/domain/entities/panel-solar.entidad.ts` | `PanelSolar` |
| Dominio (DTO) | `node/src/domain/entities/dtos/paneles/filtrar-paneles.dto.ts` | `DtoFiltrarPaneles` |
| Dominio (puerto repositorio) | `node/src/domain/repositories/repositorio-paneles.ts` | `RepositorioPaneles` |
| Dominio (puerto fuente de datos) | `node/src/domain/datasources/fuente-datos-paneles.ts` | `FuenteDatosPaneles` |
| Dominio (error) | `node/src/domain/datasources/errors/custom.error.ts` | `CustomError` |
| Infraestructura (fuente de datos) | `node/src/infrastructure/datasources/fuente-datos-paneles.impl.ts` | `FuenteDatosPanelesImpl` |
| Infraestructura (repositorio) | `node/src/infrastructure/repositories/repositorio-paneles.impl.ts` | `RepositorioPanelesImpl` |
| Infraestructura (script SQL) | `node/src/infrastructure/base-datos/script_paneles_solares.sql` | — |
| Presentación (controlador) | `node/src/presentation/paneles/controlador.ts` | `ControladorPaneles` |
| Presentación (rutas del módulo) | `node/src/presentation/paneles/rutas.ts` | `RutasPaneles` |
| Presentación (rutas raíz) | `node/src/presentation/rutas-v1.ts` | `RutasV1` (monta `/panels`) |

El SQL vive únicamente en `infrastructure/`. El dominio no conoce Express ni
MySQL, y la composición de dependencias se hace en
`presentation/paneles/rutas.ts`.

---

## Base de datos

- **Base de datos:** `gemeloDigital`.
- **Tabla:** `paneles_solares`.
- **Script de creación y datos iniciales:**
  `node/src/infrastructure/base-datos/script_paneles_solares.sql`.

```sql
CREATE TABLE IF NOT EXISTS paneles_solares (
    id                    VARCHAR(30)       NOT NULL,
    fabricante            VARCHAR(100)      NOT NULL,
    modelo                VARCHAR(60)       NOT NULL,
    potencia_watts        DECIMAL(10,2)     NOT NULL,
    eficiencia_porcentaje DECIMAL(5,2)      NOT NULL,
    tecnologia            VARCHAR(40)       NOT NULL,
    garantia_anios        SMALLINT UNSIGNED NOT NULL,
    ancho_metros          DECIMAL(5,2)      NOT NULL,
    alto_metros           DECIMAL(5,2)      NOT NULL,
    descripcion           VARCHAR(500)      NOT NULL,
    es_demostracion       BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_actualizacion   DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_paneles_fabricante (fabricante),
    KEY idx_paneles_potencia (potencia_watts)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Notas de diseño:

- `id` es texto para conservar identificadores legibles como
  `DEMO-PANEL-001`.
- `potencia_watts`, `eficiencia_porcentaje`, `ancho_metros` y `alto_metros` son
  `DECIMAL`; la infraestructura los convierte a número al mapear la entidad.
- Los índices por fabricante y potencia aceleran los filtros del endpoint.
- Los fabricantes y modelos sembrados son ficticios y están marcados con
  `es_demostracion = TRUE`.

### Ejecutar el script

```bash
mysql -u root -p gemeloDigital < node/src/infrastructure/base-datos/script_paneles_solares.sql
```

El script es idempotente para la tabla y actualiza los tres paneles de
demostración si ya existen.

---

## Prueba rápida

Con el servidor levantado (`npm run dev` dentro de `node/`):

```bash
# 1. Catálogo completo
curl http://localhost:3100/api/v1/panels

# 2. Filtrar por fabricante (coincidencia parcial)
curl "http://localhost:3100/api/v1/panels?fabricante=Demo%20Uno"

# 3. Filtrar por potencia mínima
curl "http://localhost:3100/api/v1/panels?potenciaMinimaWatts=500"

# 4. Combinar filtros
curl "http://localhost:3100/api/v1/panels?fabricante=Demo%20Uno&potenciaMinimaWatts=500"

# 5. Filtro sin coincidencias (responde 200 con arreglo vacío)
curl "http://localhost:3100/api/v1/panels?fabricante=NoExiste"

# 6. Potencia inválida (debe responder 400)
curl "http://localhost:3100/api/v1/panels?potenciaMinimaWatts=abc"

# 7. Potencia negativa (debe responder 400)
curl "http://localhost:3100/api/v1/panels?potenciaMinimaWatts=-1"
```

(El puerto depende de la variable `PORT` de `node/src/.env`; por defecto 3100.)

---

## Notas y trabajo futuro

- **Datos ficticios:** los fabricantes, modelos y especificaciones son de
  demostración. Antes de usar el catálogo en producción hay que cargar productos
  reales verificados en MySQL.
- **Filtro de fabricante:** la coincidencia es parcial y no distingue
  mayúsculas. Si se necesita una coincidencia exacta, se puede ajustar la
  consulta y el fallback en memoria.
- **Catálogo vacío frente a filtro sin coincidencias:** si la tabla tiene datos
  pero el filtro no encuentra nada, se devuelve `paneles: []`; el fallback solo
  se activa cuando la tabla está vacía o no existe.
- **Persistencia:** este módulo es de solo lectura; no crea ni modifica paneles
  desde la API.
- **Seguridad:** el endpoint todavía no tiene autenticación, CORS, limitador de
  peticiones ni manejador global de errores; quedan pendientes del `AGENTS.md`.
- **Pruebas:** `node/src/pruebas/endpoints.test.ts` cubre el catálogo completo,
  los filtros por fabricante y potencia, un filtro sin coincidencias y los
  errores `400`.
