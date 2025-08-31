# To-Do App - Runbook de Instalación y Despliegue

## 📋 Descripción del Proyecto

Aplicación de gestión de tareas (To-Do) desarrollada con Django REST Framework (backend) y Next.js (frontend), siguiendo arquitectura de microservicios con PostgreSQL como base de datos.

## 🏗️ Arquitectura del Sistema

```txt
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   PostgreSQL    │
│   (Next.js)     │◄──►│   (Django)      │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerrequisitos

### Software Requerido

- **Node.js** 18.x o superior
- **Python** 3.11 o superior
- **Docker** y **Docker Compose**
- **Git**

### Verificación de Prerrequisitos

```bash
# Verificar Node.js
node --version
npm --version

# Verificar Python
python3 --version
pip3 --version

# Verificar Docker
docker --version
docker-compose --version

# Verificar Git
git --version
```

## 🚀 Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
# Navegar al directorio del proyecto
cd proyecto

# Verificar estructura del proyecto
ls -la
```

### Paso 2: Configurar Variables de Entorno

#### Backend (.env)

```bash
# Navegar al directorio backend
cd backend

# Crear archivo .env
cat > .env << EOF
# Configuración de Base de Datos
DATABASE_NAME=todo_db
DATABASE_USER=todo_user
DATABASE_PASSWORD=todo_password
DATABASE_HOST=db
DATABASE_PORT=5432

# Configuración de Django
DJANGO_SECRET_KEY=tu_clave_secreta_muy_segura_aqui
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Configuración JWT
JWT_SECRET_KEY=tu_jwt_secret_key_aqui
JWT_ACCESS_TOKEN_LIFETIME=5
JWT_REFRESH_TOKEN_LIFETIME=1

# Configuración CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF
```

#### Frontend (.env.local)

```bash
# Navegar al directorio frontend
cd ../frontend

# Crear archivo .env.local
cat > .env.local << EOF
# Configuración de la API
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EOF
```

### Paso 3: Configurar Entorno Virtual (Backend)

```bash
# Regresar al directorio backend
cd ../backend

# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate  # En macOS/Linux
# venv\Scripts\activate  # En Windows

# Verificar que el entorno virtual está activo
which python
pip list
```

### Paso 4: Instalar Dependencias

#### Backend

```bash
# Asegurar que el entorno virtual está activo
source venv/bin/activate

# Actualizar pip
pip install --upgrade pip

# Instalar dependencias
pip install -r requirements.txt

# Verificar instalación
pip list
```

#### Frontend

```bash
# Navegar al directorio frontend
cd ../frontend

# Instalar dependencias
npm install

# Verificar instalación
npm list --depth=0
```

## 🗄️ Configuración de Base de Datos

### Paso 1: Iniciar Servicios con Docker

```bash
# Regresar al directorio backend
cd ../backend

# Iniciar servicios de base de datos
docker-compose up -d db

# Verificar que PostgreSQL está ejecutándose
docker-compose ps
docker logs proyecto_db_1
```

### Paso 2: Verificar Conexión a Base de Datos

```bash
# Conectar a PostgreSQL
docker-compose exec db psql -U todo_user -d todo_db

# Comandos útiles en PostgreSQL:
# \l          - Listar bases de datos
# \dt         - Listar tablas
# \q          - Salir

# Salir de PostgreSQL
\q
```

## 🔄 Migraciones y Configuración Inicial

### Paso 1: Ejecutar Migraciones

```bash
# Asegurar que el entorno virtual está activo
source venv/bin/activate

# Ejecutar migraciones
python manage.py migrate

# Verificar estado de migraciones
python manage.py showmigrations
```

### Paso 2: Crear Superusuario

```bash
# Crear superusuario para administración
python manage.py createsuperuser

# Seguir las instrucciones en pantalla:
# Username: admin
# Email: admin@example.com
# Password: (ingresar contraseña segura)
# Password (again): (confirmar contraseña)
```

## 🚀 Arranque de Servicios

### Opción A: Desarrollo Local (Recomendado para desarrollo)

#### Backend (Local)

```bash
# Asegurar que el entorno virtual está activo
source venv/bin/activate

# Ejecutar servidor de desarrollo
python manage.py runserver 0.0.0.0:8000

# Verificar que el servidor está ejecutándose
curl http://localhost:8000/api/
```

#### Frontend (Local)

```bash
# En una nueva terminal, navegar al frontend
cd frontend

# Ejecutar servidor de desarrollo
npm run dev

# Verificar que el servidor está ejecutándose
curl http://localhost:3000
```

### Opción B: Docker Compose (Recomendado para producción)

```bash
# Regresar al directorio backend
cd ../backend

# Iniciar todos los servicios
docker-compose up -d

# Verificar estado de servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f
```

## 🧪 Verificación de Instalación

### Paso 1: Verificar Backend

```bash
# Probar endpoint de salud
curl http://localhost:8000/api/

# Probar endpoint de autenticación
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123","email":"test@example.com"}'
```

### Paso 2: Verificar Frontend

```bash
# Abrir navegador y visitar
open http://localhost:3000

# Verificar en consola del navegador que no hay errores
# F12 -> Console
```

### Paso 3: Verificar Base de Datos

```bash
# Conectar y verificar tablas
docker-compose exec db psql -U todo_user -d todo_db -c "\dt"

# Verificar datos de usuario
docker-compose exec db psql -U todo_user -d todo_db -c "SELECT * FROM users_user;"
```

## 🔧 Comandos Útiles

### Desarrollo Backend

```bash
# Ejecutar tests
python manage.py test

# Crear nueva migración
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Shell de Django
python manage.py shell

# Crear superusuario
python manage.py createsuperuser

# Formatear código
black .
flake8 .
```

### Desarrollo Frontend

```bash
# Ejecutar tests
npm test

# Linting
npm run lint

# Build para producción
npm run build

# Servidor de producción
npm start
```

### Docker

```bash
# Ver logs de servicios
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache
```

## 🐛 Solución de Problemas Comunes

### Error: Puerto ya en uso

```bash
# Verificar procesos en puertos
lsof -i :8000
lsof -i :3000
lsof -i :5432

# Matar proceso si es necesario
kill -9 <PID>
```

### Error: Base de datos no accesible

```bash
# Verificar estado de contenedor
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs db

# Reiniciar servicio de base de datos
docker-compose restart db
```

### Error: Dependencias no encontradas

```bash
# Backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
npm install
```

### Error: Migraciones fallidas

```bash
# Verificar estado de migraciones
python manage.py showmigrations

# Resetear migraciones (¡CUIDADO! Esto elimina datos)
python manage.py migrate --fake-initial

# Crear migraciones desde cero
python manage.py makemigrations --empty
```

## 📊 Monitoreo y Logs

### Verificar Logs en Tiempo Real

```bash
# Backend logs
docker-compose logs -f web

# Frontend logs (en terminal donde ejecuta npm run dev)
# Los logs aparecen en la terminal del frontend

# Base de datos logs
docker-compose logs -f db
```

### Verificar Estado de Servicios

```bash
# Estado de contenedores
docker-compose ps

# Uso de recursos
docker stats

# Verificar conectividad
curl -I http://localhost:8000/api/
curl -I http://localhost:3000
```

## 🔒 Configuración de Seguridad

### Variables de Entorno Críticas

```bash
# Generar claves seguras
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Actualizar .env con claves generadas
# DJANGO_SECRET_KEY=clave_generada_aqui
# JWT_SECRET_KEY=otra_clave_generada_aqui
```

### Configuración de Firewall

```bash
# Verificar puertos abiertos
netstat -tulpn | grep -E ':(8000|3000|5432)'

# Configurar firewall (ejemplo para Ubuntu)
sudo ufw allow 8000
sudo ufw allow 3000
sudo ufw allow 5432
```

## 📚 Recursos Adicionales

- [Documentación de Django](https://docs.djangoproject.com/)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de Docker](https://docs.docker.com/)

## 🤝 Soporte

Para reportar problemas o solicitar ayuda:

1. Verificar logs de errores
2. Revisar esta documentación
3. Consultar issues del repositorio
4. Contactar al equipo de desarrollo

---

**Nota**: Este runbook está diseñado para seguirse paso a paso. Cada paso debe completarse exitosamente antes de continuar con el siguiente.
