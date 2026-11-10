# Matriz de trazabilidad de SICEN

| Requerimiento Funcional | Endpoint relacionado | Método HTTP | Descripción |
|---|---|---|---|
| RF-01: Gestión de formularios censales | /formularios | GET | Consultar todos los formularios censales registrados. |
| RF-01: Gestión de formularios censales | /formularios/:id | GET | Consultar un formulario censal específico. |
| RF-01: Gestión de formularios censales | /formularios | POST | Crear un formulario censal desde cero o utilizando una plantilla. |
| RF-01: Gestión de formularios censales | /formularios/:id | PUT | Actualizar la información de un formulario censal. |
| RF-01: Gestión de formularios censales | /formularios/:id | DELETE | Eliminar un formulario censal. |
| RF-02: Configuración de preguntas | /formularios/:id/preguntas | POST | Agregar preguntas de selección única, selección múltiple o descripción. |
| RF-02: Configuración de preguntas | /formularios/:id/preguntas/:preguntaId | PUT | Modificar una pregunta existente. |
| RF-02: Configuración de preguntas | /formularios/:id/preguntas/:preguntaId | DELETE | Eliminar una pregunta del formulario. |
| RF-03: Personalización de formularios | /formularios/:id/personalizacion | PUT | Modificar la apariencia y los enunciados del formulario. |
| RF-04: Gestión de instructivos | /formularios/:id/instructivos | POST | Adjuntar un instructivo al formulario censal. |
| RF-04: Gestión de instructivos | /formularios/:id/instructivos | GET | Consultar los instructivos asociados al formulario. |
| RF-05: Configuración del flujo de aprobación | /formularios/:id/flujo-aprobacion | PUT | Configurar las etapas de envío, revisión, aceptación y devolución para subsanación. |
| RF-06: Gestión de colaboradores | /usuarios | GET | Consultar los colaboradores registrados en el sistema. |
| RF-06: Gestión de colaboradores | /usuarios | POST | Registrar nuevos colaboradores en el sistema. |
| RF-06: Gestión de colaboradores | /usuarios/:id | PUT | Actualizar la información de un colaborador. |
| RF-06: Gestión de colaboradores | /usuarios/:id | DELETE | Eliminar un colaborador del sistema. |
