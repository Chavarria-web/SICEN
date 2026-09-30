# Bitácora 1: ERS

**Universidad CENFOTEC**
**Proyecto Integrador 1**

**Estudiantes:**
- Edwin Alberto Chavarría Rojas
- Kendall Adolfo Segura Arias
- Kai Leiva Chavarria

**Profesora:** Verónica Isabel Mora Lezcano

**Fecha:** Septiembre 3, 2026

---

## 1. Introducción

### 1.1 Propósito

El presente documento tiene como propósito definir la Especificación de Requisitos de Software (ERS) del Sistema de Gestión de Censos Escolares (SICEN).

La ERS establece las funcionalidades, usuarios, reglas, restricciones y condiciones que deberá cumplir el sistema para apoyar al Ministerio de Educación Pública (MEP) en la gestión de información estadística de los centros educativos públicos y privados del país.

Este documento servirá como base para la planificación, desarrollo, pruebas y seguimiento del proyecto.

### 1.2 Alcance

SICEN será una aplicación web destinada a centralizar y automatizar los procesos relacionados con el levantamiento, registro, seguimiento y validación de información de los censos escolares.

El sistema permitirá gestionar formularios censales, configurar censos, administrar colaboradores, registrar información de los centros educativos, realizar procesos de revisión y subsanación, consultar estados e historiales y generar reportes.

El sistema estará orientado a tres perfiles principales:

- Jefatura de la DAE.
- Técnico de la DAE.
- Director del centro educativo o encargado.

---

## 2. Descripción general del sistema

### 2.1 Contexto

El Ministerio de Educación Pública requiere modernizar los procesos relacionados con el levantamiento, registro, seguimiento y validación de información estadística de los centros educativos públicos y privados.

Actualmente, algunos de estos procesos utilizan registros manuales, diferentes medios de intercambio de información y actividades de consolidación y validación de datos.

Esta situación puede ocasionar:

- Inconsistencias en la información.
- Duplicidad de datos.
- Dificultades para dar seguimiento a los censos.
- Largos períodos de procesamiento.
- Dificultades para consultar información histórica.
- Falta de trazabilidad de las gestiones realizadas.

SICEN plantea una solución tecnológica que permita centralizar estos procesos y facilitar la gestión de información confiable para la toma de decisiones institucionales.

---

## 3. Objetivo general

Desarrollar e implementar un sistema web de gestión de censos escolares que permita automatizar y centralizar los procesos de levantamiento, registro, seguimiento y validación de datos estadísticos de los centros educativos públicos y privados del país.

---

## 4. Perfiles de usuario y actores involucrados

### 4.1 Jefatura de la DAE (Administrador general)

Es el usuario responsable de administrar y configurar los elementos principales del sistema.

Entre sus funciones se encuentran:

- Crear, actualizar y eliminar formularios censales.
- Crear formularios desde cero o utilizando plantillas.
- Configurar los tipos de preguntas.
- Personalizar la apariencia de los formularios.
- Registrar enunciados.
- Adjuntar instructivos.
- Definir el flujo de aprobación.
- Registrar colaboradores de la DAE.
- Asignar roles y permisos.
- Asignar colaboradores por dirección regional o circuito.
- Configurar censos.
- Asociar formularios a modelos de oferta educativa.
- Definir fechas de apertura y cierre.
- Abrir, pausar y cerrar censos.
- Configurar mensajes personalizados.
- Consultar visores.
- Consultar reportes generales.

### 4.2 Técnico de la DAE (Colaborador de seguimiento)

Es el usuario encargado del seguimiento, revisión y validación de la información enviada por los centros educativos asignados.

Entre sus funciones principales se encuentran:

- Visualizar los centros educativos asignados.
- Revisar formularios enviados.
- Consultar el estado de los formularios.
- Aceptar formularios.
- Devolver formularios para subsanación.
- Registrar las gestiones realizadas.
- Enviar comunicados y alertas.
- Generar informes de seguimiento.
- Generar cortes de matrícula censal.
- Generar reportes por módulo.
- Consultar el historial de gestiones.

### 4.3 Director del centro educativo o encargado

Es el usuario responsable de completar y enviar la información censal correspondiente a su centro educativo.

Entre sus funciones se encuentran:

- Consultar los censos disponibles para su centro.
- Consultar los censos según su oferta educativa autorizada.
- Completar formularios censales.
- Utilizar datos precargados cuando estén disponibles.
- Consultar instructivos.
- Consultar el estado del censo.
- Enviar formularios completos.
- Recibir notificaciones y alertas.
- Consultar solicitudes de subsanación.
- Corregir formularios devueltos.
- Reenviar formularios corregidos.
- Consultar el historial de gestiones sobre sus envíos.

---

## 5. Requisitos funcionales

### RF-01: Gestión de formularios censales

El sistema deberá permitir a la Jefatura de la DAE crear, consultar, actualizar y eliminar formularios censales, ya sea desde cero o utilizando una plantilla existente.

### RF-02: Configuración de preguntas

El sistema deberá permitir a la Jefatura de la DAE agregar, modificar y eliminar preguntas de los siguientes tipos:

- Selección única.
- Selección múltiple.
- Descripción.

### RF-03: Personalización de formularios

El sistema deberá permitir a la Jefatura de la DAE personalizar la apariencia de los formularios y registrar los enunciados correspondientes.

### RF-04: Gestión de instructivos

El sistema deberá permitir a la Jefatura de la DAE adjuntar instructivos a los formularios censales y permitir su consulta a los usuarios autorizados.

### RF-05: Configuración del flujo de aprobación

El sistema deberá permitir a la Jefatura de la DAE configurar el flujo de aprobación de los formularios, incluyendo su envío, revisión, aceptación y devolución para subsanación.

### RF-06: Gestión de colaboradores

El sistema deberá permitir a la Jefatura de la DAE registrar y administrar colaboradores, asignándoles roles, permisos y un ámbito de seguimiento por dirección regional o circuito.

### RF-07: Configuración de censos

El sistema deberá permitir a la Jefatura de la DAE crear y configurar censos, asociando formularios a modelos de oferta educativa y estableciendo fechas de apertura y cierre.

### RF-08: Control del estado del censo

El sistema deberá permitir a la Jefatura de la DAE abrir, pausar y cerrar manualmente los censos.

### RF-09: Gestión de notificaciones

El sistema deberá permitir a la Jefatura de la DAE configurar mensajes personalizados para alertas y avisos informativos relacionados con los censos.

### RF-10: Consulta de censos

El sistema deberá permitir al Director del centro educativo consultar los censos disponibles para su centro de acuerdo con la oferta educativa autorizada.

### RF-11: Llenado de formularios censales

El sistema deberá permitir al Director del centro educativo completar los formularios censales asignados, mostrando los datos previamente registrados cuando estén disponibles.

### RF-12: Envío de formularios

El sistema deberá permitir al Director del centro educativo enviar los formularios censales una vez completados.

### RF-13: Seguimiento del estado

El sistema deberá permitir al Director del centro educativo consultar el estado actual de sus formularios censales.

### RF-14: Revisión de formularios

El sistema deberá permitir al Técnico de la DAE consultar y revisar los formularios enviados por los centros educativos que tenga asignados.

### RF-15: Aceptación de formularios

El sistema deberá permitir al Técnico de la DAE aceptar los formularios que cumplan con los criterios establecidos.

### RF-16: Devolución para subsanación

El sistema deberá permitir al Técnico de la DAE devolver un formulario al centro educativo cuando requiera correcciones y registrar el motivo de la devolución.

### RF-17: Corrección y reenvío

El sistema deberá permitir al Director corregir los formularios devueltos para subsanación y reenviarlos para una nueva revisión.

### RF-18: Historial de gestiones

El sistema deberá registrar las acciones realizadas sobre cada formulario o censo, incluyendo como mínimo el usuario responsable, fecha, acción realizada y estado resultante.

### RF-19: Informes de seguimiento

El sistema deberá permitir al Técnico de la DAE generar informes de seguimiento, cortes de matrícula censal y reportes por módulo.

### RF-20: Consulta del historial

El sistema deberá permitir a los usuarios autorizados consultar el historial de gestiones realizadas sobre los censos y formularios correspondientes a su ámbito de acceso.

### RF-21: Visores y reportes generales

El sistema deberá permitir a la Jefatura de la DAE consultar visores y reportes generales relacionados con la información recopilada mediante los censos.

---

## 6. Suposiciones

Para el desarrollo de SICEN se establecen las siguientes suposiciones:

- Los usuarios contarán con credenciales válidas para ingresar al sistema.
- Los centros educativos estarán previamente registrados.
- Los centros educativos podrán ser identificados de forma única.
- Las ofertas educativas estarán previamente definidas.
- Los usuarios tendrán un rol asignado.
- La Jefatura de la DAE será responsable de configurar los censos.
- Los colaboradores estarán asociados a una dirección regional o circuito según corresponda.
- Los usuarios tendrán acceso a Internet.
- La información proporcionada por los usuarios será responsabilidad de estos.

---

## 7. Dependencias

El funcionamiento de SICEN dependerá de:

- Infraestructura para alojar la aplicación web.
- Base de datos para almacenar la información.
- Servicio de autenticación y autorización.
- Servicio de almacenamiento para los instructivos y archivos adjuntos.
- Servicio de notificaciones para el envío de alertas y avisos.
- Información actualizada de centros educativos.
- Información actualizada de las ofertas educativas.

---

## 8. Restricciones generales

- SICEN será desarrollado como una aplicación web.
- El acceso a la aplicación deberá estar protegido mediante autenticación.
- Las funcionalidades deberán estar restringidas según el rol del usuario.
- La información deberá gestionarse de forma centralizada.
- Las acciones relevantes deberán mantener trazabilidad.
- Los usuarios no podrán realizar acciones para las cuales no tengan permisos.
- El sistema deberá conservar el historial de las gestiones realizadas.

---

## 9. Restricciones de diseño e implementación

Tecnologías utilizadas:

| Componente | Tecnología |
|---|---|
| Frontend | HTML5, CSS3 y JavaScript |
| Diseño de interfaz | Bootstrap 5 |
| Backend | Node.js |
| Frameworks backend | Express.js |
| Base de datos | MongoDB |
| Control de versiones | Git y GitHub |
| Gestión del proyecto | Jira |
| Pruebas de API | Postman o Thunder Client |

---

## 10. Convenciones de nomenclatura

- **Archivos:** nombres en minúsculas y separados por guiones (`-`).
- **Variables y funciones:** se utilizará `camelCase`.

---

## 11. Estrategia de branches

- **main:** contendrá las versiones estables y librerías del proyecto.
- **feature:** se utilizará para desarrollar funcionalidades específicas.
- **fix:** se utilizará para solucionar errores detectados durante el desarrollo.
- **docs:** se utilizará para cambios en la documentación.

---

## 12. Tipos de commits

Se utilizarán los siguientes tipos de commit:

| Tipo | Descripción |
|---|---|
| `[new]` | Se ha creado un método o recurso en el programa que no existía antes del commit. |
| `[improved]` | Se mejoró la forma en que se hacía un método o cómo se mostraba algo. No es un problema como tal. |
| `[fixed]` | Se corrigió un problema o algo que estaba mal. |
| `[update]` | Se reemplazó un recurso o código por otro realizado por alguien más. |
| `[init]` | Commit especial que indica el inicio del repositorio. |

---

## Historias de Usuario completas

### Historias de Usuario y Criterios de Aceptación

#### HU-01: Gestión de formularios

Como Jefatura de la DAE, quiero crear y configurar formularios censales, para adaptarlos a las necesidades de cada censo.

**Criterios de aceptación:**

- Crear, consultar, modificar y eliminar formularios.
- Agregar preguntas y definir sus tipos.
- Personalizar formularios e incluir instructivos.

**RF relacionados:** RF-01, RF-02, RF-03, RF-04.

#### HU-02: Configuración y control de censos

Como Jefatura de la DAE, quiero configurar y controlar los censos, para administrar su disponibilidad y funcionamiento.

**Criterios de aceptación:**

- Asociar formularios y modelos de oferta educativa.
- Definir fechas de apertura y cierre.
- Abrir, pausar y cerrar censos.

**RF relacionados:** RF-07, RF-08.

#### HU-03: Gestión de colaboradores y permisos

Como Jefatura de la DAE, quiero administrar los colaboradores y sus permisos, para asignar responsabilidades de seguimiento.

**Criterios de aceptación:**

- Registrar y administrar colaboradores.
- Asignar roles y permisos.
- Asignar un ámbito de seguimiento.

**RF relacionado:** RF-06.

#### HU-04: Registro y envío de información

Como Director del centro educativo, quiero consultar, completar y enviar los formularios censales, para proporcionar la información requerida.

**Criterios de aceptación:**

- Consultar los censos disponibles.
- Completar y enviar los formularios.
- Consultar el estado de los formularios enviados.

**RF relacionados:** RF-10, RF-11, RF-12, RF-13.

#### HU-05: Revisión y validación

Como Técnico de la DAE, quiero revisar y validar los formularios enviados, para asegurar que la información cumpla con los criterios establecidos.

**Criterios de aceptación:**

- Consultar formularios de centros asignados.
- Aceptar formularios que cumplan los criterios.
- Devolver formularios indicando el motivo de la corrección.

**RF relacionados:** RF-14, RF-15, RF-16.

#### HU-06: Corrección y trazabilidad

Como usuario del sistema, quiero corregir formularios devueltos y consultar su historial, para dar seguimiento a las gestiones realizadas.

**Criterios de aceptación:**

- Permitir corregir y reenviar formularios devueltos.
- Registrar las acciones realizadas.
- Consultar el historial según los permisos del usuario.

**RF relacionados:** RF-17, RF-18, RF-20.

#### HU-07: Informes y notificaciones

Como usuario autorizado, quiero consultar informes, reportes y recibir notificaciones, para dar seguimiento a la información de los censos.

**Criterios de aceptación:**

- Generar informes de seguimiento y reportes.
- Consultar visores y reportes generales.
- Configurar y mostrar mensajes relacionados con los censos.

**RF relacionados:** RF-09, RF-19, RF-21.

---

## Inconvenientes

- Dificultad para interpretar algunos requisitos debido a que inicialmente no estaban suficientemente detallados.
- Se requirió modificar algunas historias de usuario después de revisar nuevamente los requisitos funcionales.
- Dificultad para mantener la trazabilidad entre requisitos funcionales, historias de usuario y tareas de Jira.
- Se presentaron problemas técnicos al configurar o trabajar con el repositorio del proyecto.
- Dificultad para definir criterios de aceptación que fueran claros y comprobables.
- Se necesitó reorganizar algunas tareas debido a cambios en la planificación del equipo.
- Algunas funcionalidades requirieron mayor análisis antes de poder dividirlas en tareas de desarrollo.
- Se presentaron inconvenientes de coordinación al distribuir las actividades entre los integrantes del equipo.

---

## Enlace del Proyecto en Jira

Tablero - Bitácora 1 SICEN - SCRUM board - Jira

## Enlace al repositorio de GitHub

Chavarria-web/SICEN: Repositorio para el proyecto SICEN
