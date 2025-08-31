# Requisitos y Reglas de Negocio

Este documento recoge los requisitos que debe cumplir la To-Do App para resolver la descoordinación y falta de visibilidad en la gestión de tareas de la organización, así como las reglas de negocio que rigen su funcionamiento.

---

## 1. Requisitos de Negocio

- Unificar en un único repositorio la creación, asignación y seguimiento de tareas.
- Permitir a cada usuario ver únicamente sus propias tareas y su estado.
- Facilitar la coordinación interdepartamental mostrando fechas de creación, vencimiento y estado.
- Evitar duplicidad de tareas y tareas “fantasma” (creadas pero nunca asignadas ni cerradas).
- Ofrecer métricas básicas de carga de trabajo (número de tareas pendientes/terminadas).
- Garantizar un proceso seguro de registro e inicio de sesión.

## 2. Requisitos Funcionales

1. **Autenticación**
   - Registro de usuario con `username`, `email` único y `password`.
   - Inicio de sesión → JWT `access` + `refresh`.
   - Refresh de token.
   - Logout → elimine token local y limpie cabecera Authorization.

2. **CRUD de Tareas**
   - Crear tarea con:
     • `title` (obligatorio)
     • `description` (opcional)
     • `status` (ToDo/Done; default = ToDo)
     • `responsible` (oculto, se asigna al user actual).
   - Listar tareas filtradas por `responsible = usuario actual`.
   - Ver detalle de una tarea.
   - Editar:
     • Sólo se permite cambiar `status`.
     • Sólo responsable puede modificarla.
   - Borrar tarea.

3. **Visibilidad y Navegación (Frontend)**
   - Ruta `/login`, `/register` y rutas protegidas `/tasks`, `/tasks/new`, `/tasks/[id]`.
   - Al entrar a rutas protegidas sin token → redirigir a `/login`.
   - Al iniciar o registrar → redirigir automáticamente a `/tasks`.
   - Al hacer logout → redirigir a `/login`.

4. **Interfaz de Usuario**
   - Listado con título, estado y fecha de creación.
   - Formulario de nueva tarea con validación inline.
   - Página de detalle con botón para toggle status y eliminar.

5. **Documentación & Tests**
   - Documentación automática OpenAPI + Swagger UI en `/api/docs/`.
   - Cobertura de pruebas unitarias e integración para:
     • Serializers (validación de campos).
     • Endpoints (201/200/400/401/404).
     • Flujo de login/register.
     • CRUD de tareas.

## 3. Requisitos Técnicos

- **Backend**
  - Django 4.x + Django REST Framework.
  - Autenticación JWT con `djangorestframework-simplejwt`.
  - PostgreSQL 13+ (via `psycopg2-binary`).
  - CORS configurado (`django-cors-headers`).
  - Contenedores Docker (web + db).

- **Frontend**
  - Next.js 15.5.2 con App Router (no `src/`).
  - TypeScript + ESLint.
  - Tailwind CSS (o similar) para estilos.
  - Axios para llamadas HTTP.
  - React Hook Form para formularios.
  - Context API para gestionar el token JWT y el estado de usuario.

## 4. Requisitos No Funcionales

- **Seguridad**
  - HTTPS en producción.
  - Validación/sanitización server-side de todas las entradas.
  - Emails únicos y passwords hasheadas (bcrypt).

- **Rendimiento**
  - Paginación o lazy-load para listados (+100 tareas).
  - Tiempos de respuesta <300 ms para endpoints críticos.

- **Disponibilidad y Escalabilidad**
  - Arquitectura en contenedores (Docker Compose).
  - Backups automáticos de PostgreSQL.

- **Mantenibilidad**
  - Linter y formateador configurados (Black, Flake8, ESLint, Prettier).
  - CI/CD: tests + linters en cada PR.
  - Documentación de setup y despliegue.

## 5. Reglas de Negocio

1. **Responsable Automático**
   - Al crear una tarea, el campo `responsible` se asigna automáticamente al usuario autenticado; no puede elegirse en el formulario.

2. **Visibilidad de Tareas**
   - Cada usuario sólo puede ver/modificar/borrar tareas donde `responsible = su usuario`.

3. **Estados y Transiciones**
   - Solo dos estados válidos: `todo` y `done`.
   - La transición es reversible (un `done` puede volver a `todo`).

4. **Unicidad de Usuario**
   - Cada email de usuario debe ser único.
   - `username` único en el sistema.

5. **Seguridad de Endpoints**
   - Todos los endpoints de tareas requieren JWT válido.
   - El endpoint de registro está abierto; login y refresh abierto; todo lo demás autenticado.

6. **Validación de Campos**
   - `title` no puede estar vacío.
   - `description` opcional.
   - `status` debe ser uno de los valores admitidos.

---

Con estos requisitos y reglas de negocio claros, podemos garantizar que la aplicación unifica la gestión de tareas, mejora la coordinación entre equipos y proporciona visibilidad y control de la carga de trabajo de forma segura y escalable.```
