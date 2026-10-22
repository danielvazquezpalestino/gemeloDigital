# Municipios del Estado de Puebla — GET /api/ubicaciones/municipios

## Descripción

Endpoint que expone el catálogo completo de los **217 municipios oficiales del
estado de Puebla** (fuente: INEGI, división municipal 2020). Cada municipio se
acompaña de la macrorregión socioeconómica a la que pertenece, conforme a la
regionalización vigente del **Plan Estatal de Desarrollo (PED) 2024-2030** del
Gobierno del Estado de Puebla.

Los datos se persisten en la tabla `municipios` de MySQL y se leen mediante el
pool de conexiones del proyecto (arquitectura limpia por capas).

## Método y ruta

| Método | Ruta | Controlador | Método del controlador | Estado |
|---|---|---|---|---|
| GET | `/api/ubicaciones/municipios` | `ControladorUbicaciones` | `obtenerMunicipios` | Implementado |

## Autenticación

No requerida.

## Parámetros

No acepta parámetros de ruta, de consulta ni de cuerpo.

## Respuesta exitosa

Código: `200 OK`

```json
{
    "mensaje": "Municipios de Puebla obtenidos correctamente",
    "municipios": [
        { "id": 1, "nombre": "Acajete", "region": "Angelópolis" },
        { "id": 2, "nombre": "Acateno", "region": "Sierra Nororiental" },
        { "id": 3, "nombre": "Acatlán", "region": "Mixteca" }
    ]
}
```

La lista completa contiene **217 municipios**, ordenados alfabéticamente por
`nombre`.

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | número | Clave INEGI del municipio (de 1 a 217) |
| `nombre` | texto | Nombre oficial del municipio |
| `region` | texto | Macrorregión socioeconómica a la que pertenece |

### Valores posibles de `region` (7 macrorregiones)

| Macrorregión | Municipios |
|---|---|
| Sierra Norte | 38 |
| Sierra Nororiental | 26 |
| Valle de Serdán | 40 |
| Angelópolis | 22 |
| Valle de Atlixco y Matamoros | 22 |
| Mixteca | 43 |
| Tehuacán y Sierra Negra | 26 |
| **Total** | **217** |

## Códigos de respuesta

| Código | Cuerpo | Descripción |
|---|---|---|
| 200 | `{ "mensaje": "...", "municipios": [...] }` | Lista obtenida correctamente |
| 500 | `{ "mensaje": "No se pudieron obtener los municipios" }` | Error interno (p. ej. MySQL inaccesible o tabla sin datos). El detalle real solo se registra en el servidor vía `console.error` |

## Arquitectura (capas y archivos)

```
GET /api/ubicaciones/municipios
   │
   ├─▶ presentation/rutas.ts                 AppRoutes            → monta /api/ubicaciones
   │      └─▶ presentation/ubicaciones/rutas.ts      RutasUbicaciones         → GET /municipios
   │             └─▶ presentation/ubicaciones/controlador.ts
   │                    ControladorUbicaciones.obtenerMunicipios
   │                          ▼
   │                  domain/repositories/repositorio-ubicaciones.ts
   │                    RepositorioUbicaciones                    (puerto, abstracto)
   │                          ▼
   │                  infrastructure/repositories/repositorio-ubicaciones.impl.ts
   │                    RepositorioUbicacionesImpl
   │                          ▼
   │                  domain/datasources/fuente-datos-ubicaciones.ts
   │                    FuenteDatosUbicaciones                     (puerto, abstracto)
   │                          ▼
   │                  infrastructure/datasources/fuente-datos-ubicaciones.impl.ts
   │                    FuenteDatosUbicacionesImpl
   │                          ▼  SELECT id, nombre, region FROM municipios ORDER BY nombre ASC
   │                  config/database.ts      pool de conexiones MySQL
   │
   └─▶ 200 { "mensaje": "...", "municipios": [ { id, nombre, region }, ... ] }
```

| Capa | Archivo | Símbolo |
|---|---|---|
| Dominio (entidad) | `node/src/domain/entities/municipio.entidad.ts` | `Municipio` |
| Dominio (puerto repositorio) | `node/src/domain/repositories/repositorio-ubicaciones.ts` | `RepositorioUbicaciones` |
| Dominio (puerto fuente de datos) | `node/src/domain/datasources/fuente-datos-ubicaciones.ts` | `FuenteDatosUbicaciones` |
| Infraestructura (fuente de datos) | `node/src/infrastructure/datasources/fuente-datos-ubicaciones.impl.ts` | `FuenteDatosUbicacionesImpl` |
| Infraestructura (repositorio) | `node/src/infrastructure/repositories/repositorio-ubicaciones.impl.ts` | `RepositorioUbicacionesImpl` |
| Presentación (controlador) | `node/src/presentation/ubicaciones/controlador.ts` | `ControladorUbicaciones` |
| Presentación (rutas del módulo) | `node/src/presentation/ubicaciones/rutas.ts` | `RutasUbicaciones` |
| Presentación (rutas raíz) | `node/src/presentation/rutas.ts` | `AppRoutes` (monta `/api/ubicaciones`) |

La consulta SQL vive únicamente en la capa de infraestructura
(`FuenteDatosUbicacionesImpl`), sobre el pool de `config/database.ts`.

## Base de datos

- **Tabla:** `municipios` (base de datos `gemeloDigital`).
- **Campos:** `id INT PRIMARY KEY`, `nombre VARCHAR(100)`, `region VARCHAR(50)`.
- **Script de creación e inserción:** `node/src/infrastructure/base-datos/script_municipios.sql`.
  Contiene el `CREATE TABLE` y las 217 filas del catálogo oficial.
- Para poblar la tabla, ejecutar el script sobre la base de datos configurada
  en `node/src/.env` (`DB_NAME`) antes de usar el endpoint.

## Prueba rápida

```bash
curl http://localhost:3100/api/ubicaciones/municipios
```

(El puerto depende de la variable `PORT` de `node/src/.env`; por defecto 3100.)

## Notas y trabajo futuro

- El catálogo de municipios es estático (solo cambia si el INEGI modifica la
  división municipal); una posible mejora es cachear la lista en memoria tras
  la primera consulta.
- Mejoras posibles del endpoint: filtro por `?region=`, búsqueda por nombre
  (`?buscar=`), paginación y orden configurable.
- La tabla `municipios` permite normalizar después a una tabla de catálogo de
  macrorregiones (con `region` como clave foránea) si el modelo crece.
