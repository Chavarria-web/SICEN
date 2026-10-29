## Edwin Alberto Chavarría Rojas Kai Leiva Chavarria Kendall Segura Arias

## Universidad CENFOTEC Proyecto Integrador 1

## Veronica Isabel Mora Lezcano Profesora:

## Septiembre 29, 2026


## 1. Propósito y alcance del sistema

## 1.1 Propósito

SICEN es una aplicación web que permite al Ministerio de Educación Pública (MEP) automatizar y centralizar el levantamiento, registro, seguimiento y validación de la información estadística de los centros educativos públicos y privados del país. Sustituye el manejo manual de registros y el intercambio de información por distintos medios, que hoy generan inconsistencias, duplicidad de datos y largos periodos de procesamiento.

El sistema cubre el ciclo completo de un censo: la Jefatura de la DAE construye los formularios y configura el censo, los directores de los centros educativos completan y envían la información, los técnicos de la DAE la revisan (aceptan o devuelven para subsanación) y los supervisores consultan los resultados aceptados. Cada gestión queda registrada en un historial auditable.

En un escenario real, SICEN podría integrarse como un nuevo módulo de la plataforma ministerial. Por eso el diseño separa claramente el cliente, la API y los datos.

## 1.2 Arquitectura

## 1.2.1 Estilo arquitectónico

SICEN sigue un modelo cliente-servidor con arquitectura en tres capas. El navegador nunca accede directamente a la base de datos: toda comunicación pasa por una API REST que expone los recursos del sistema en formato JSON.

| Capa | Responsabilidad | Componentes |
| --- | --- | --- |
| Presentación | Interfaz de usuario por rol, validaciones | HTML, CSS y JavaScript (fetch). |
| (cliente) | básicas de formulario, consumo de la API |   |
|   | de forma asíncrona. |   |
| Lógica de negocio | Autenticación, autorización por rol y por | Node.js con Express: rutas, |
| (servidor) | alcance (centros asignados), reglas del | controladores, servicios y middlewares. |
|   | censo, transiciones de estado de los |   |
|   | formularios, generación de notificaciones |   |
|   | y reportes. |   |
| Datos | Persistencia, consulta e integridad de la | MongoDB Atlas con Mongoose como |
|   | información. | ODM. |

## 1.2.2 Flujo de una petición

- 1. El usuario interactúa con la interfaz (por ejemplo, un director pulsa «Enviar censo»).

- 2. JavaScript envía una petición HTTP con cuerpo JSON a la API REST, incluyendo el token de sesión en el encabezado Authorization.

- 3. El middleware de autenticación valida el token; el middleware de roles verifica que el rol tenga permiso sobre el recurso.


- 4. El controlador recibe la petición y el servicio aplica las reglas de negocio (por ejemplo, que el censo esté abierto y que el formulario esté completo). El modelo consulta o modifica MongoDB Atlas.

- 5. El servicio registra la gestión en el historial y genera las notificaciones que correspondan.

- 6. El servidor responde con JSON y un código HTTP (200, 201, 400, 401, 403, 404, 409, 500) y el cliente actualiza la interfaz.

## 1.2.3 Estructura propuesta del proyecto

```
/server
/config conexión a MongoDB Atlas, variables de entorno
/models esquemas Mongoose
/routes definición de endpoints
/controllers manejo de peticiones y respuestas
/services reglas de negocio (censos, envíos, notificaciones)
/middlewares autenticación, roles, alcance, validación, errores
/client
/pages /css /js /assets
```

## 1.2.4 Diseño de la API REST

| Recurso | Método y ruta | Descripción |
| --- | --- | --- |
| Autenticación | POST /api/auth/login | Inicio y cierre de sesión. |
|   | POST /api/auth/logout |   |
| Usuarios | GET, POST /api/usuarios | Colaboradores de la DAE, |
|   | PUT, DELETE /api/usuarios/:id | directores y supervisores; |
|   |   | asignación de roles y permisos. |
| Asignaciones | GET, POST /api/asignaciones | Centros asignados a cada técnico |
|   | DELETE /api/asignaciones/:id | por región o circuito. |
| Centros | GET /api/centros | Expediente del centro y su oferta |
| educativos | GET /api/centros/:id | educativa autorizada (filtrado por |
|   |   | rol). |
| Formularios | GET, POST /api/formularios | Construcción de formularios |
|   | GET, PUT, DELETE /api/formularios/:id | censales, plantillas, apariencia, |
|   | POST /api/formularios/:id/duplicar | instructivos y flujo de aprobación. |
| Censos | GET, POST /api/censos | Configuración del censo y cambio |
|   | PUT /api/censos/:id | de estado (abrir, pausar, cerrar). |
|   | PATCH /api/censos/:id/estado |   |
| Envíos censales GET /api/envios |   | Llenado, envío, revisión, aceptación |
|   | GET, PUT /api/envios/:id | y devolución de formularios. |
|   | POST /api/envios/:id/enviar |   |
|   | POST /api/envios/:id/aceptar |   |
|   | POST /api/envios/:id/devolver |   |
| Historial | GET /api/envios/:id/historial | Gestiones realizadas sobre cada |
|   |   | envío. |


| Recurso | Método y ruta | Descripción |
| --- | --- | --- |
| Notificaciones | GET /api/notificaciones | Alertas, avisos y comunicados a |
|   | PATCH /api/notificaciones/:id/leida | supervisores. |
|   | POST /api/comunicados |   |
| Mensajes del | GET, PUT /api/mensajes-notificador | Mensajes personalizados que |
| notificador |   | configura la Jefatura de la DAE. |
| Reportes | GET /api/reportes/generales | Visores y reportes generales, |
|   | GET /api/reportes/seguimiento | informes de seguimiento, cortes de |
|   | GET /api/reportes/cortes | matrícula censal y reportes por |
|   | GET /api/reportes/modulos | módulo. |

## 1.2.5 Seguridad y control de acceso

La API es sin estado (stateless), usa los verbos HTTP de forma semántica e intercambia datos en JSON. La autenticación se realiza con JWT, las contraseñas se almacenan cifradas con bcrypt y el acceso se controla por rol y por alcance:

| Rol | Alcance de datos y permisos |
| --- | --- |
| Jefatura de la DAE | Acceso total a la configuración: formularios, censos, colaboradores, roles, |
| (Administrador general) | mensajes del notificador y reportes generales. |
| Técnico de la DAE | Solo los centros educativos que le fueron asignados. Puede revisar, aceptar y |
|   | devolver formularios, enviar comunicados y generar informes. |
| Director del centro | Solo el expediente de su centro. Puede completar, enviar y corregir formularios |
| educativo (o encargado) | de los censos autorizados para su oferta educativa. |
| Supervisor | Permisos de visualización y verificación. Solo censos aceptados de los centros |
|   | bajo su supervisión y sus notificaciones. |

## 1.3 Base de datos (MongoDB Atlas)

Se utiliza una base de datos NoSQL orientada a documentos alojada en MongoDB Atlas. Las entidades que se consultan de forma independiente (usuarios, centros, censos, envíos) se relacionan por referencia mediante ObjectId. Los datos que no tienen vida propia se embeben en su documento padre: las preguntas y opciones dentro del formulario, y las respuestas dentro del envío censal.

## 1.3.1 Colecciones

| Colección | Campos principales |
| --- | --- |
| usuarios | _id, nombre, correo (único), passwordHash, rol (admin_dae, tecnico_dae, director, |
|   | supervisor), regionId (ref), centroId (ref, para directores), activo, fechaCreacion |
| regiones | _id, nombre (dirección regional), circuitos [ {codigo, nombre} ] (embebido) |
| ofertas_educativas | _id, nombre, modalidad, nivel |
| centros_educativos | _id, codigo (único), nombre, tipo (público / privado), regionId (ref), circuito, ofertaIds |
|   | [ref], directorId (ref), supervisorId (ref), datosPrecargados {matrícula previa, |
|   | dirección, contacto}, estado |


| Colección | Campos principales |
| --- | --- |
| asignaciones | _id, tecnicoId (ref), centroId (ref), regionId (ref), circuito, fechaAsignacion |
| formularios | _id, nombre, descripcion, esPlantilla, apariencia {color, logo, tipografía}, preguntas [ |
|   | {id, enunciado, tipo (seleccion_unica, seleccion_multiple, descripcion), opciones [], |
|   | obligatoria, orden} ] (embebido), instructivos [ {nombre, url} ], flujoAprobacion [ |
|   | {paso, rol} ], creadoPor (ref), fechaCreacion |
| censos | _id, nombre, formularioId (ref), ofertaIds [ref], fechaApertura, fechaCierre, estado |
|   | (borrador, abierto, pausado, cerrado), creadoPor (ref) |
| envios_censales | _id, censoId (ref), centroId (ref), respuestas [ {preguntaId, valor} ] (embebido), |
|   | estado (borrador, enviado, devuelto, aceptado), fechaEnvio, revisadoPor (ref), |
|   | observacion, fechaActualizacion |
| historial | _id, envioId (ref), censoId (ref), usuarioId (ref), accion (enviar, aceptar, devolver, |
|   | reenviar, cambio de estado), estadoAnterior, estadoNuevo, comentario, fecha |
| notificaciones | _id, destinatarioId (ref), tipo (alerta, aviso, subsanación, comunicado), mensaje, |
|   | envioId (ref, opcional), leida, fecha |
| mensajes_notificador _id, clave, tipo, texto, activo, actualizadoPor (ref) |   |

## 1.3.2 Relaciones

- Región: Una región tiene muchos centros educativos, muchos usuarios y muchas asignaciones (1:N).

- Centro educativo: Un centro tiene un director, un supervisor y varias ofertas educativas autorizadas (N:M con ofertas_educativas, resuelto con arreglo de referencias).

- Técnico y centros: Un técnico puede tener muchos centros asignados y un centro puede ser atendido por más de un técnico (N:M resuelto con la colección asignaciones).

- Formulario y censo: Un formulario puede usarse en varios censos (1:N). Un censo se asocia a un formulario y a uno o varios modelos de oferta educativa.

- Envío censal: envios_censales es la colección que une un censo con un centro educativo: un centro tiene un envío por censo (1:N desde censos y desde centros).

- Historial: Un envío tiene muchos registros de historial (1:N), que forman la trazabilidad auditable de cada gestión.

- Notificaciones: Un usuario recibe muchas notificaciones (1:N), asociadas opcionalmente a un envío.

## 1.3.3 Estados

| Entidad | Estados y transiciones |
| --- | --- |
| Censo | borrador → abierto ⇄ pausado → cerrado. La Jefatura de la DAE controla las |
|   | transiciones manualmente y por fechas de apertura y cierre. |
| Envío censal (formulario | borrador → enviado → aceptado. Desde enviado, el técnico puede devolverlo: |
| del centro) | enviado → devuelto → (corrección) → enviado. |


## 1.3.4 Restricciones e índices

- Índice único en usuarios.correo y centros_educativos.codigo.

- Índice compuesto único (censoId, centroId) en envios_censales, para garantizar un envío por centro y por censo y evitar duplicidad de información.

- Índice en historial (envioId, fecha) para consultar rápidamente el historial de cada envío.

- Índice en asignaciones (tecnicoId) para filtrar los centros visibles de cada técnico.

- Índice en notificaciones (destinatarioId, leida) para listar las alertas pendientes.

## 1.4 Tecnologías utilizadas

| Categoría | Tecnología | Uso en el proyecto |
| --- | --- | --- |
| Entorno de ejecución | Node.js | Ejecución del servidor y de la API REST. |
| Framework backend | Express.js | Enrutamiento, middlewares de autenticación, roles y |
|   |   | manejo de errores. |
| Base de datos | MongoDB Atlas | Base de datos NoSQL en la nube. |
| ODM | Mongoose | Esquemas, validación de datos y consultas. |
| Estructura web | HTML5 | Marcado semántico de las pantallas. |
| Presentación | CSS3 | Estilos y diseño responsivo (Flexbox y Grid). |
| Interactividad | JavaScript (ES6+) | Lógica del cliente y comunicación asíncrona con la API |
|   |   | mediante fetch. |
| Seguridad | JWT y bcrypt | Sesiones sin estado y cifrado de contraseñas. |
| Control de versiones | Git y GitHub | Repositorio y trabajo colaborativo del equipo. |
| Gestión del proyecto | Jira | Historias de usuario, tareas y seguimiento. |
| Diseño | Figma | Wireframes y prototipos de la interfaz. |

## 1.5 Alcance

## 1.5.1 Incluido

- Inicio y cierre de sesión con control de acceso por rol: Jefatura de la DAE, Técnico de la DAE, Director del centro educativo y Supervisor.

- Construcción, actualización y eliminación de formularios censales, desde cero o a partir de plantillas, con tres tipos de pregunta: selección única, selección múltiple y descripción.

- Personalización de la apariencia del formulario, registro de enunciados, adjunto de instructivos y definición del flujo de aprobación.

- Registro de colaboradores de la DAE, asignación de roles y permisos, y seguimiento por dirección regional o circuito.


- Configuración de censos: asociación de formularios a modelos de oferta educativa y definición de fechas de apertura y cierre.

- Apertura, pausa y cierre manual de censos.

- Expediente del centro educativo, con los censos disponibles según su oferta educativa autorizada y el estado del censo del centro.

- Llenado de formularios con datos precargados, consulta de instructivos, envío del censo completo y corrección y reenvío de formularios devueltos.

- Revisión por parte del técnico de la DAE: consulta del estado, aceptación o devolución para subsanación de los formularios de los centros que tiene asignados.

- Consulta de censos aceptados por parte del supervisor, únicamente de los centros bajo su supervisión.

- Notificador interno: alertas, avisos y comunicados, con mensajes personalizables por la Jefatura de la DAE.

- Historial auditable de las gestiones realizadas sobre cada censo y cada envío.

- Visores y reportes generales, informes de seguimiento, cortes de matrícula censal y reportes por módulo.

- Interfaz web responsiva con criterios de usabilidad y accesibilidad.

- 1.5.2 Excluido

- Integración real con la plataforma ministerial u otros sistemas externos (MEP, Registro Civil). Los datos precargados se administran dentro de SICEN.

- Aplicación móvil nativa.

- Envío de notificaciones por correo electrónico o SMS. Las notificaciones se muestran dentro del sistema.

- Tipos de pregunta distintos de selección única, selección múltiple y descripción (por ejemplo, carga de archivos por el centro, escalas o matrices).

- Módulos académicos o administrativos: notas, asistencia, matrícula estudiantil detallada, horarios o pagos.

- Firma digital de los formularios.

- Funcionamiento sin conexión (offline).

- Analítica avanzada, tableros de inteligencia de negocio o modelos predictivos.

- Soporte multilenguaje (solo español).


## 2. Modelado del sistema

## 2.1 Diagrama de casos de uso

El diagrama de casos de uso muestra los cuatro actores de SICEN y los casos de uso que ejecuta cada uno. Se elabora a partir de las tablas de las secciones 2.2 y 2.3.

*Figura 1. Diagrama de casos de uso de SICEN*

## 2.2 Actores

| Actor | Tipo | Descripción |
| --- | --- | --- |
| Jefatura de la DAE | Primario | Construye formularios, registra colaboradores y asigna roles, |
| (Administrador general) |   | configura y abre, pausa o cierra los censos, configura los |
|   |   | mensajes del notificador y accede a los reportes generales. |


| Actor | Tipo | Descripción |
| --- | --- | --- |
| Técnico de la DAE | Primario | Da seguimiento a los centros educativos que le fueron |
| (Colaborador de |   | asignados: revisa, acepta o devuelve formularios, envía |
| seguimiento) |   | comunicados y genera informes. |
| Director del centro educativo | Primario | Completa, envía y corrige los formularios censales de su |
| (o encargado) |   | centro. |
| Supervisor | Primario | Consulta los censos aceptados de los centros bajo su |
|   |   | supervisión y recibe notificaciones sobre el estado del |
|   |   | llenado. |

## 2.3 Casos de uso

| ID | Caso de uso | Actor(es) |
| --- | --- | --- |
| CU-01 | Iniciar sesión | Todos los actores |
| CU-02 Cerrar sesión |   | Todos los actores |
| CU-03 Gestionar formularios censales (crear desde cero o |   | Jefatura de la DAE |
|   | desde plantilla, actualizar, eliminar) |   |
| CU-04 Definir preguntas del formulario (selección única, múltiple |   | Jefatura de la DAE |
|   | y descripción) |   |
| CU-05 Personalizar apariencia, registrar enunciados, adjuntar |   | Jefatura de la DAE |
|   | instructivos y definir flujo de aprobación |   |
| CU-06 Gestionar colaboradores de la DAE, roles y permisos |   | Jefatura de la DAE |
| CU-07 Asignar centros educativos a técnicos por dirección |   | Jefatura de la DAE |
|   | regional o circuito |   |
| CU-08 Configurar censo (asociar formulario a ofertas |   | Jefatura de la DAE |
|   | educativas, fechas de apertura y cierre) |   |
| CU-09 Abrir, pausar o cerrar censo |   | Jefatura de la DAE |
| CU-10 Configurar mensajes personalizados del notificador |   | Jefatura de la DAE |
| CU-11 Consultar visores y reportes generales |   | Jefatura de la DAE |
| CU-12 Consultar centros educativos asignados |   | Técnico de la DAE |
| CU-13 Revisar formularios remitidos y consultar su estado |   | Técnico de la DAE |
| CU-14 Aceptar formulario |   | Técnico de la DAE |
| CU-15 Devolver formulario para subsanación |   | Técnico de la DAE |
| CU-16 Enviar comunicados y alertas a los supervisores |   | Técnico de la DAE |
| CU-17 Generar informes de seguimiento, cortes de matrícula |   | Técnico de la DAE |
|   | censal y reportes por módulo |   |
| CU-18 Consultar historial de gestiones de un censo o envío |   | Técnico de la DAE, Director |
| CU-19 Consultar expediente del centro, censos disponibles y |   | Director |
|   | estado del censo |   |
| CU-20 Completar formulario censal con datos precargados |   | Director |


| ID | Caso de uso | Actor(es) |
| --- | --- | --- |
| CU-21 Consultar instructivos del formulario |   | Director |
| CU-22 Enviar censo completo |   | Director |
| CU-23 Corregir y reenviar formulario devuelto |   | Director |
| CU-24 Consultar censos aceptados de los centros bajo su |   | Supervisor |
|   | supervisión |   |
| CU-25 Recibir notificaciones y alertas sobre el estado del |   | Director, Supervisor |
|   | llenado y solicitudes de subsanación |   |

## 2.4 Relaciones entre casos de uso

- «include»: todos los casos de uso, excepto CU-01 y CU-02, incluyen CU-01, porque toda acción requiere estar autenticado.

- «include»: CU-03 incluye CU-04, porque un formulario no puede guardarse sin al menos una pregunta.

- «include»: CU-22 incluye la validación de que el formulario esté completo antes de enviarse.

- «extend»: CU-05 extiende CU-03, porque la apariencia, los instructivos y el flujo de aprobación son opcionales al construir el formulario.

- «extend»: CU-14 y CU-15 extienden CU-13, porque se ejecutan a partir de la revisión de un formulario remitido.

- «extend»: CU-21 extiende CU-20, porque el director puede consultar el instructivo mientras completa el formulario.

- «extend»: CU-23 extiende CU-20, porque un formulario devuelto se vuelve a abrir para su corrección.

- Notificaciones: CU-15, CU-16, CU-22 y CU-23 generan notificaciones que se consultan en CU-25.

- Historial: CU-14, CU-15, CU-22 y CU-23 registran una entrada en el historial auditable, consultable en CU-18.

## Reglas de negocio asociadas

- CU-20, CU-22 y CU-23 solo pueden ejecutarse si el censo está abierto (CU-09). Un censo pausado o cerrado bloquea el llenado y el envío.

- CU-19 y CU-20 solo muestran los censos asociados a la oferta educativa autorizada del centro.

- CU-12, CU-13, CU-14 y CU-15 se limitan a los centros asignados al técnico en CU-07.

- CU-24 muestra únicamente censos en estado aceptado y de los centros bajo supervisión del usuario.

- CU-15 requiere un comentario que indique qué debe subsanarse.
