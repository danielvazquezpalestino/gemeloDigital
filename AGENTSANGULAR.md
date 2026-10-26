AGENTS.md — Gemelo Digital FRONTEND

Guía persistente para cualquier agente (o persona) que trabaje en este repositorio.
Si una instrucción de este archivo contradice a un pedido puntual, el pedido puntual manda; en caso de duda, preguntar.

## 1. Descripción del proyecto

Gemelo Digital FRONTEND es la aplicación web que permite visualizar, monitorear e interactuar con el gemelo digital del sistema.
- Consume una API backend (REST/WebSocket) y presenta el estado del sistema en tiempo real o casi real.
- TODO: describir el dominio concreto (qué se gemelea: planta, equipo, proceso, edificio, etc.).
- TODO: listar los usuarios/roles principales y los casos de uso clave.

## 2. Stack

- Lenguaje: TypeScript (modo estricto).
- Framework: Angular 21 (standalone, signals, zoneless).
- Estado: signals de Angular (signal, computed, effect, linkedSignal). TODO: confirmar si se usa NgRx SignalStore.
- Datos remotos: HttpClient (con interceptores funcionales) y resource/httpResource donde aplique.
- Tiempo real: TODO (WebSocket nativo / RxJS webSocket / SignalR).
- Formularios: Reactive Forms. TODO: evaluar Signal Forms (en evolución en v21).
- Estilos: TODO (SCSS / Tailwind / Angular Material).
- Visualización 3D/2D: TODO (Three.js / D3 / otra).
- Pruebas: Vitest (runner por defecto en v21); E2E con Playwright (TODO confirmar).
- Calidad: ESLint (angular-eslint), Prettier, typecheck en CI.
- Gestor de paquetes: TODO (npm / pnpm / yarn).

## 3. Arquitectura

Se usa Arquitectura Hexagonal (Puertos y Adaptadores) aplicada al frontend.
El objetivo es que la lógica de negocio no dependa de Angular, del navegador ni de la API.

### 3.1 Capas

1. Dominio (núcleo): entidades, objetos de valor, reglas de negocio y errores de dominio.
   TypeScript puro. Sin decoradores de Angular, sin HttpClient, sin RxJS de UI.
2. Aplicación: casos de uso (orquestan el dominio) y definición de puertos.
   Depende solo del dominio. Los casos de uso son servicios @Injectable.
3. Infraestructura (adaptadores de salida / driven): implementaciones de los puertos
   (HttpClient, WebSocket, almacenamiento local, mapeadores DTO <-> dominio).
   Depende de aplicación y dominio.
4. Presentación (adaptadores de entrada / driving): componentes standalone, páginas,
   rutas, guardias, stores de UI. Invoca casos de uso; nunca llama directo a la API.

### 3.2 Regla de dependencias

Presentación -> Aplicación -> Dominio
Infraestructura -> Aplicación -> Dominio

- El dominio no importa de ninguna otra capa ni de @angular/*.
- La aplicación no importa de infraestructura ni de presentación.
- Presentación no importa de infraestructura; recibe los adaptadores por inyección
  de dependencias, cableados en la raíz de composición (app.config.ts).
- Los DTO de la API viven solo en infraestructura. Nunca se filtran al dominio ni a la UI.

### 3.3 Estructura de carpetas

src/app/
  dominio/
    entidades/
    objetosValor/
    errores/
  aplicacion/
    casosDeUso/
    puertos/           (clases abstractas o InjectionToken + interfaz)
  infraestructura/
    http/              (interceptores funcionales, configuración base)
    websocket/
    repositorios/      (implementaciones de los puertos)
    mapeadores/        (DTO <-> entidades de dominio)
    almacenamiento/
  presentacion/
    compartido/        (componentes, pipes y directivas reutilizables, sin lógica de negocio)
    funcionalidades/   (por funcionalidad: páginas, componentes, stores, rutas propias)
    diseno/            (layout: cabecera, menú, contenedores)
  nucleo/
    configuracion/     (entorno, constantes de configuración)
    proveedores/       (cableado puerto -> adaptador)
  app.config.ts        (raíz de composición; nombre estándar de Angular)
  app.routes.ts        (nombre estándar de Angular)
  app.ts               (nombre estándar de Angular)
src/main.ts

### 3.4 Flujo típico

Componente -> store/caso de uso -> puerto (clase abstracta o token) -> adaptador (repositorio HTTP) -> API
La respuesta vuelve mapeada a entidades de dominio, nunca como DTO crudo.

Ejemplo: visorGemelo -> obtenerEstadoGemelo -> repositorioGemelo -> repositorioGemeloHttp -> API

### 3.5 Reglas clave

- Un caso de uso = una responsabilidad = un servicio (verbo + sustantivo).
- Los puertos se definen en aplicación; los adaptadores los implementan en infraestructura.
- Cableado en app.config.ts: { provide: repositorioGemelo, useClass: repositorioGemeloHttp }.
- Los componentes son "tontos": renderizan y delegan. Sin lógica de negocio ni HttpClient.
- Los errores de infraestructura se traducen a errores de dominio/aplicación antes de llegar a la UI.
- Las dependencias externas (librerías 3D, gráficos, etc.) se encapsulan detrás de un adaptador.
- Las variables de entorno solo se leen en nucleo/configuracion.
- Cada funcionalidad se carga con lazy loading (loadComponent / loadChildren).

### 3.6 Reglas de Angular 21

- Todo componente es standalone (no usar NgModules en código nuevo).
- Inyección con inject(), no por constructor, salvo que haya una razón puntual.
- changeDetection: ChangeDetectionStrategy.OnPush en todos los componentes.
- Aplicación zoneless: no depender de zone.js ni de NgZone.
- Entradas y salidas con input(), input.required(), output(), model(); no usar @Input/@Output.
- Consultas con viewChild(), contentChild() y sus variantes de signals.
- Plantillas con control flow (@if, @for con track, @switch, @defer); no usar *ngIf/*ngFor.
- Estado local con signal/computed; usar RxJS solo para flujos de eventos y tiempo real.
- Interoperar con toSignal/toObservable en el borde; evitar suscripciones manuales.
  Si hay que suscribirse, usar takeUntilDestroyed.
- Guardias, resolvedores e interceptores en su forma funcional.
- No usar bindings con llamadas a métodos en plantillas; usar computed o pipes puros.

## 4. Convenciones de código

Regla general: todo el código se escribe en español y en camelCase (primera palabra en
minúscula, siguientes con inicial mayúscula, sin guiones ni guiones bajos).
Sin tildes, sin ñ y sin caracteres especiales en identificadores, archivos y carpetas
(configuracion, diseno, aplicacion).

Excepciones obligatorias (no se traducen ni se modifican):
- API y palabras reservadas de Angular y TypeScript: signal, computed, effect, input, output,
  inject, ngOnInit, @Component, @Injectable, Observable, etc.
- Archivos que exigen las herramientas: *.spec.ts, app.config.ts, app.routes.ts, app.ts,
  main.ts, package.json, tsconfig.json, angular.json.
- Selectores de componentes: kebab-case con prefijo del proyecto (TODO: definir, ej. gd-visor-gemelo),
  porque HTML no admite elementos personalizados sin guion.
- Términos técnicos sin traducción habitual pueden mantenerse (http, dto, url, api, websocket),
  escritos en camelCase dentro del nombre (urlBaseApi, respuestaHttp).

### 4.1 Clases, métodos, propiedades, variables, parámetros, constantes

- Clases, interfaces, tipos y enums: camelCase en español, nombre sustantivo
  (lecturaSensor, estadoGemelo, tipoAlerta).
- Puertos: sin prefijo "I" (repositorioGemelo, pasarelaTelemetria).
- Adaptadores: nombre del puerto + tecnología (repositorioGemeloHttp, pasarelaTelemetriaWebsocket).
- Casos de uso: verbo en infinitivo + sustantivo (obtenerEstadoGemelo, registrarAlerta, listarSensores).
- Componentes: camelCase en español (visorGemelo, panelAlertas). TODO: confirmar si se mantiene el sufijo Componente.
- Directivas de atributo: camelCase con prefijo (gdResaltar).
- Métodos y funciones: verbo en infinitivo (calcularPromedio, cargarGemelo, actualizarEstado).
- Propiedades, variables y parámetros: sustantivos en camelCase (estadoActual, listaSensores, idGemelo).
- Signals: nombre sustantivo sin sufijo; los observables llevan sufijo $ (telemetria$).
- Booleanos: prefijo es/tiene/puede/debe (estaConectado, tieneAlertas, puedeEditar, debeReintentar).
- Constantes globales: camelCase (maximoReintentos, tiempoEsperaMs).
- InjectionToken: camelCase (urlBaseApi).
- Evitar "any"; usar "unknown" y estrechar el tipo. Preferir readonly e inmutabilidad en el dominio.
- Visibilidad explícita: private/protected/public; los miembros usados solo en plantilla, protected.
- Un solo vocabulario de dominio: cada concepto tiene un único nombre en español en todo el
  repositorio (no mezclar "sensor" con "medidor" para lo mismo). Mantener un glosario en docs/glosario.md.

### 4.2 Nombres de archivos y carpetas

- Carpetas y archivos: camelCase en español (casosDeUso, objetosValor, visorGemelo.ts).
- Componentes: visorGemelo.ts, visorGemelo.html, visorGemelo.scss. TODO: si se mantiene el sufijo, visorGemelo.componente.ts.
- Entidades: gemelo.entidad.ts. Objetos de valor: idSensor.valor.ts.
- Casos de uso: obtenerEstadoGemelo.casoUso.ts.
- Puertos: gemelo.repositorio.ts. Adaptadores: gemeloHttp.repositorio.ts.
- Mapeadores: gemelo.mapeador.ts. DTO: gemelo.dto.ts.
- Guardias, interceptores y resolvedores: autenticacion.guardia.ts, autenticacion.interceptor.ts, gemelo.resolvedor.ts.
- Pruebas: junto al archivo, con sufijo .spec.ts (excepción por herramienta).
- Un archivo = un concepto principal exportado. Evitar barrels (index.ts) que oculten ciclos de dependencias.
- El nombre del archivo debe coincidir con el nombre de lo que exporta (visorGemelo.ts exporta visorGemelo).

### 4.3 Comentarios y documentación

- Idioma: español, en todo el repositorio (comentarios, TSDoc, ADR, README, mensajes de commit y de PR).
- Mensajes de usuario (textos de la interfaz, errores visibles): español; TODO: definir si habrá i18n.
- El código debe explicarse solo; comentar el "por qué", no el "qué".
- Usar TSDoc en puertos, casos de uso y funciones públicas del dominio.
- Prohibido dejar código comentado; usar el control de versiones.
- TODO/FIXME con responsable o ticket: // TODO(nombre): descripción (#123).
- Documentar decisiones arquitectónicas relevantes en docs/adr/ (un ADR por decisión).
- Los mensajes de commit mantienen el prefijo de Conventional Commits en inglés (feat:, fix:, refactor:, test:, docs:, chore:)
  y la descripción en español.

### 4.4 Pruebas

- Dominio y casos de uso: pruebas unitarias sin TestBed cuando sea posible; los puertos se simulan con dobles de prueba.
- Adaptadores: pruebas con provideHttpClientTesting y HttpTestingController.
- Presentación: TestBed con componentes standalone, probando comportamiento visible.
- Todo caso de uso nuevo debe incluir su prueba.
- Los casos de prueba se describen en español: it('debe devolver el estado del gemelo cuando la API responde').

### 4.5 Control de cambios

- Commits: Conventional Commits (feat:, fix:, refactor:, test:, docs:, chore:) con descripción en español.
- Ramas: funcionalidad/*, correccion/*, tarea/*.
- Antes de abrir un PR: lint, typecheck, pruebas y build deben pasar.

### 4.6 Qué debe hacer un agente al trabajar aquí

- Respetar la regla de dependencias de la sección 3.2; si un cambio la rompe, detenerse y preguntar.
- Colocar cada archivo nuevo en su capa correcta antes de escribir código.
- Generar código con las prácticas de la sección 3.6; no usar APIs deprecadas de Angular.
- Nombrar en español y camelCase según la sección 4, respetando las excepciones obligatorias.
- No introducir librerías nuevas sin consultar.
- Hacer cambios pequeños y enfocados; no refactorizar código ajeno al pedido.