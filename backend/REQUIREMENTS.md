# Requisitos mínimos para el MVP de la To-Do App

## 1. Requisitos de negocio mínimos

- Registro e inicio de sesión de usuarios (roles: `admin`, `usuario`).
- CRUD de tareas con campos básicos:
  - título
  - descripción
  - estado (ToDo / Done)
  - responsable
- Listado de tareas con filtros por estado y responsable.
- Visualización de detalle de tarea y posibilidad de marcar como completada.
- Asignación y reasignación de tareas a un usuario.

## 2. Requisitos técnicos mínimos

### 2.1 Backend

- Django 4.x + Django REST Framework.
- Modelos:
  - `User` (extensible)
  - `Task`
- Endpoints REST:
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/tasks`
  - POST `/api/tasks`
  - GET `/api/tasks/:id`
  - PUT `/api/tasks/:id`
  - DELETE `/api/tasks/:id`
- Autenticación JWT (django-rest-framework-simplejwt).
- Configuración de CORS para conectar con el frontend.

### 2.2 Frontend

- Next.js 13.x (JavaScript o TypeScript).
- Páginas:
  - `/login`
  - `/register`
  - `/tasks` (listado con filtros)
  - `/tasks/[id]` (detalle + marcar completada)
  - `/tasks/new` (formulario de creación)
- Consumo de API REST vía `fetch` o `axios`.

### 2.3 Base de datos

- PostgreSQL 13+.

### 2.4 Orquestación

- Docker Compose con servicios:
  - `django`
  - `nextjs`
  - `postgres`
- Archivo `.env` para credenciales y secretos (JWT_SECRET, DATABASE_NAME, etc.).

### 2.5 Desarrollo y calidad

- Linter / formateador:
  - Python: Black + Flake8
  - JavaScript/TypeScript: ESLint + Prettier
- Scripts básicos:
  - migraciones y arranque del backend (`make migrate`, `make run`)
  - arranque del frontend (`npm run dev`)

## 3. Requisitos no funcionales mínimos

### 3.1 Seguridad

- HTTPS en producción (NGINX o Vercel).
- Protección CSRF en Django y cabeceras CORS definidas.
- Validación y sanitización de entradas en el backend.

### 3.2 Rendimiento

- Tiempo de respuesta < 300 ms en endpoints de listado y detalle con hasta 100 tareas.

### 3.3 Disponibilidad

- Despliegue en contenedores separados (escalable horizontalmente).
- Backups diarios de PostgreSQL (dumps automatizados).

### 3.4 Mantenibilidad

- README con pasos de instalación, migraciones y arranque.
- Pruebas unitarias básicas:
  - `pytest` para Django
  - `Jest` para Next.js
- Documentación de la API (Swagger o Redoc).

### 3.5 Escalabilidad futura

- Versionado de la API (`/api/v1/...`).
- Separación clara de capas en el backend:
  - `models`
  - `serializers`
  - `views`
