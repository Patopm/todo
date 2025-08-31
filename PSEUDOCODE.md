# Pseudocódigo del Sistema To-Do App

## 📋 Descripción General

Este documento describe el flujo de interacción entre Usuario, Frontend (Next.js), Backend (Django REST Framework) y Base de Datos (PostgreSQL) en la aplicación To-Do.

## 🏗️ Arquitectura de Capas

```txt
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
│                    (Frontend - Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE API                              │
│                    (Backend - Django REST)                  │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE DATOS                            │
│                    (PostgreSQL)                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujos de Interacción

### 1. AUTENTICACIÓN Y AUTORIZACIÓN

#### 1.1 Registro de Usuario

```pseudocode
ALGORITMO: Registro de Usuario
ENTRADA: username, email, password
SALIDA: Usuario registrado y autenticado

INICIO
    // Frontend - Formulario de Registro
    SI usuario_envía_formulario_registro ENTONCES
        validar_datos_formulario()
        SI datos_válidos ENTONCES
            enviar_POST_a("/api/auth/register/", datos)
        SINO
            mostrar_errores_validación()
        FIN SI
    FIN SI

    // Backend - Endpoint de Registro
    SI POST "/api/auth/register/" ENTONCES
        validar_datos_entrada()
        SI datos_válidos ENTONCES
            verificar_username_único()
            verificar_email_único()
            SI ambos_únicos ENTONCES
                crear_usuario_en_db(username, email, password_hash)
                generar_tokens_jwt()
                retornar_tokens_y_usuario()
            SINO
                retornar_error("Usuario o email ya existe")
            FIN SI
        SINO
            retornar_error("Datos inválidos")
        FIN SI
    FIN SI

    // Base de Datos - Creación de Usuario
    FUNCIÓN crear_usuario_en_db(username, email, password_hash)
        INSERT INTO users_user (username, email, password, date_joined)
        VALUES (username, email, password_hash, NOW())
        retornar_id_usuario_creado()
    FIN FUNCIÓN
FIN
```

#### 1.2 Inicio de Sesión

```pseudocode
ALGORITMO: Inicio de Sesión
ENTRADA: username, password
SALIDA: Tokens JWT y datos de usuario

INICIO
    // Frontend - Formulario de Login
    SI usuario_envía_formulario_login ENTONCES
        validar_datos_formulario()
        SI datos_válidos ENTONCES
            enviar_POST_a("/api/auth/login/", datos)
        SINO
            mostrar_errores_validación()
        FIN SI
    FIN SI

    // Backend - Endpoint de Login
    SI POST "/api/auth/login/" ENTONCES
        validar_credenciales(username, password)
        SI credenciales_válidas ENTONCES
            obtener_usuario_de_db(username)
            generar_tokens_jwt(usuario)
            retornar_tokens_y_usuario()
        SINO
            retornar_error("Credenciales inválidas")
        FIN SI
    FIN SI

    // Base de Datos - Verificación de Credenciales
    FUNCIÓN validar_credenciales(username, password)
        SELECT id, username, email, password
        FROM users_user
        WHERE username = username
        SI usuario_encontrado Y password_hash_coincide ENTONCES
            retornar VERDADERO
        SINO
            retornar FALSO
        FIN SI
    FIN FUNCIÓN
FIN
```

### 2. GESTIÓN DE TAREAS

#### 2.1 Listar Tareas del Usuario

```pseudocode
ALGORITMO: Listar Tareas del Usuario
ENTRADA: token_jwt
SALIDA: Lista de tareas del usuario autenticado

INICIO
    // Frontend - Página de Tareas
    SI usuario_accede_a_página_tareas ENTONCES
        obtener_token_del_localStorage()
        SI token_válido ENTONCES
            enviar_GET_a("/api/tasks/" CON Authorization: Bearer token)
        SINO
            redirigir_a_login()
        FIN SI
    FIN SI

    // Backend - Endpoint de Lista de Tareas
    SI GET "/api/tasks/" ENTONCES
        verificar_token_jwt()
        SI token_válido ENTONCES
            obtener_usuario_del_token()
            obtener_tareas_del_usuario(usuario_id)
            retornar_lista_tareas()
        SINO
            retornar_error_401("Token inválido")
        FIN SI
    FIN SI

    // Base de Datos - Consulta de Tareas
    FUNCIÓN obtener_tareas_del_usuario(usuario_id)
        SELECT id, title, description, status, created_at, updated_at
        FROM tasks_task
        WHERE responsible_id = usuario_id
        ORDER BY created_at DESC
        retornar_resultado_consulta()
    FIN FUNCIÓN
FIN
```

#### 2.2 Crear Nueva Tarea

```pseudocode
ALGORITMO: Crear Nueva Tarea
ENTRADA: title, description, token_jwt
SALIDA: Tarea creada

INICIO
    // Frontend - Formulario de Nueva Tarea
    SI usuario_envía_formulario_nueva_tarea ENTONCES
        validar_datos_formulario()
        SI datos_válidos ENTONCES
            enviar_POST_a("/api/tasks/" CON Authorization: Bearer token)
        SINO
            mostrar_errores_validación()
        FIN SI
    FIN SI

    // Backend - Endpoint de Creación de Tarea
    SI POST "/api/tasks/" ENTONCES
        verificar_token_jwt()
        SI token_válido ENTONCES
            obtener_usuario_del_token()
            validar_datos_tarea(title, description)
            SI datos_válidos ENTONCES
                crear_tarea_en_db(title, description, usuario_id)
                retornar_tarea_creada()
            SINO
                retornar_error("Datos de tarea inválidos")
            FIN SI
        SINO
            retornar_error_401("Token inválido")
        FIN SI
    FIN SI

    // Base de Datos - Inserción de Tarea
    FUNCIÓN crear_tarea_en_db(title, description, usuario_id)
        INSERT INTO tasks_task (title, description, status, responsible_id, created_at, updated_at)
        VALUES (title, description, 'todo', usuario_id, NOW(), NOW())
        retornar_id_tarea_creada()
    FIN FUNCIÓN
FIN
```

#### 2.3 Ver Detalle de Tarea

```pseudocode
ALGORITMO: Ver Detalle de Tarea
ENTRADA: task_id, token_jwt
SALIDA: Detalles completos de la tarea

INICIO
    // Frontend - Página de Detalle de Tarea
    SI usuario_accede_a_detalle_tarea(task_id) ENTONCES
        obtener_token_del_localStorage()
        SI token_válido ENTONCES
            enviar_GET_a("/api/tasks/{task_id}/" CON Authorization: Bearer token)
        SINO
            redirigir_a_login()
        FIN SI
    FIN SI

    // Backend - Endpoint de Detalle de Tarea
    SI GET "/api/tasks/{task_id}/" ENTONCES
        verificar_token_jwt()
        SI token_válido ENTONCES
            obtener_usuario_del_token()
            verificar_propiedad_tarea(task_id, usuario_id)
            SI tarea_pertenece_a_usuario ENTONCES
                obtener_detalle_tarea(task_id)
                retornar_detalle_tarea()
            SINO
                retornar_error_403("Acceso denegado")
            FIN SI
        SINO
            retornar_error_401("Token inválido")
        FIN SI
    FIN SI

    // Base de Datos - Consulta de Detalle
    FUNCIÓN obtener_detalle_tarea(task_id)
        SELECT id, title, description, status, responsible_id, created_at, updated_at
        FROM tasks_task
        WHERE id = task_id
        retornar_resultado_consulta()
    FIN FUNCIÓN
FIN
```

#### 2.4 Actualizar Tarea

```pseudocode
ALGORITMO: Actualizar Tarea
ENTRADA: task_id, datos_actualizados, token_jwt
SALIDA: Tarea actualizada

INICIO
    // Frontend - Formulario de Edición
    SI usuario_envía_formulario_edición ENTONCES
        validar_datos_formulario()
        SI datos_válidos ENTONCES
            enviar_PUT_a("/api/tasks/{task_id}/" CON Authorization: Bearer token)
        SINO
            mostrar_errores_validación()
        FIN SI
    FIN SI

    // Backend - Endpoint de Actualización
    SI PUT "/api/tasks/{task_id}/" ENTONCES
        verificar_token_jwt()
        SI token_válido ENTONCES
            obtener_usuario_del_token()
            verificar_propiedad_tarea(task_id, usuario_id)
            SI tarea_pertenece_a_usuario ENTONCES
                validar_datos_actualización()
                SI datos_válidos ENTONCES
                    actualizar_tarea_en_db(task_id, datos_actualizados)
                    retornar_tarea_actualizada()
                SINO
                    retornar_error("Datos inválidos")
                FIN SI
            SINO
                retornar_error_403("Acceso denegado")
            FIN SI
        SINO
            retornar_error_401("Token inválido")
        FIN SI
    FIN SI

    // Base de Datos - Actualización
    FUNCIÓN actualizar_tarea_en_db(task_id, datos_actualizados)
        UPDATE tasks_task
        SET title = datos_actualizados.title,
            description = datos_actualizados.description,
            status = datos_actualizados.status,
            updated_at = NOW()
        WHERE id = task_id
        retornar_tarea_actualizada()
    FIN FUNCIÓN
FIN
```

#### 2.5 Marcar Tarea como Completada

```pseudocode
ALGORITMO: Marcar Tarea como Completada
ENTRADA: task_id, token_jwt
SALIDA: Tarea marcada como completada

INICIO
    // Frontend - Botón de Completar
    SI usuario_hace_clic_en_completar_tarea ENTONCES
        obtener_token_del_localStorage()
        SI token_válido ENTONCES
            enviar_PATCH_a("/api/tasks/{task_id}/" CON status: 'done')
        SINO
            redirigir_a_login()
        FIN SI
    FIN SI

    // Backend - Endpoint de Actualización de Estado
    SI PATCH "/api/tasks/{task_id}/" ENTONCES
        verificar_token_jwt()
        SI token_válido ENTONCES
            obtener_usuario_del_token()
            verificar_propiedad_tarea(task_id, usuario_id)
            SI tarea_pertenece_a_usuario ENTONCES
                actualizar_estado_tarea(task_id, 'done')
                retornar_tarea_actualizada()
            SINO
                retornar_error_403("Acceso denegado")
            FIN SI
        SINO
            retornar_error_401("Token inválido")
        FIN SI
    FIN SI

    // Base de Datos - Actualización de Estado
    FUNCIÓN actualizar_estado_tarea(task_id, nuevo_estado)
        UPDATE tasks_task
        SET status = nuevo_estado, updated_at = NOW()
        WHERE id = task_id
        retornar_tarea_actualizada()
    FIN FUNCIÓN
FIN
```

#### 2.6 Eliminar Tarea

```pseudocode
ALGORITMO: Eliminar Tarea
ENTRADA: task_id, token_jwt
SALIDA: Confirmación de eliminación

INICIO
    // Frontend - Botón de Eliminar
    SI usuario_hace_clic_en_eliminar_tarea ENTONCES
        mostrar_confirmación_eliminación()
        SI usuario_confirma_eliminación ENTONCES
            obtener_token_del_localStorage()
            SI token_válido ENTONCES
                enviar_DELETE_a("/api/tasks/{task_id}/" CON Authorization: Bearer token)
            SINO
                redirigir_a_login()
            FIN SI
        FIN SI
    FIN SI

    // Backend - Endpoint de Eliminación
    SI DELETE "/api/tasks/{task_id}/" ENTONCES
        verificar_token_jwt()
        SI token_válido ENTONCES
            obtener_usuario_del_token()
            verificar_propiedad_tarea(task_id, usuario_id)
            SI tarea_pertenece_a_usuario ENTONCES
                eliminar_tarea_de_db(task_id)
                retornar_confirmación_eliminación()
            SINO
                retornar_error_403("Acceso denegado")
            FIN SI
        SINO
            retornar_error_401("Token inválido")
        FIN SI
    FIN SI

    // Base de Datos - Eliminación
    FUNCIÓN eliminar_tarea_de_db(task_id)
        DELETE FROM tasks_task WHERE id = task_id
        retornar_confirmación_eliminación()
    FIN FUNCIÓN
FIN
```

### 3. FILTRADO Y BÚSQUEDA

#### 3.1 Filtrar Tareas por Estado

```pseudocode
ALGORITMO: Filtrar Tareas por Estado
ENTRADA: status_filter, token_jwt
SALIDA: Lista de tareas filtradas

INICIO
    // Frontend - Filtros de Estado
    SI usuario_selecciona_filtro_estado ENTONCES
        obtener_token_del_localStorage()
        SI token_válido ENTONCES
            enviar_GET_a("/api/tasks/?status={status_filter}" CON Authorization: Bearer token)
        SINO
            redirigir_a_login()
        FIN SI
    FIN SI

    // Backend - Endpoint con Filtros
    SI GET "/api/tasks/?status={status_filter}" ENTONCES
        verificar_token_jwt()
        SI token_válido ENTONCES
            obtener_usuario_del_token()
            aplicar_filtro_estado(usuario_id, status_filter)
            retornar_tareas_filtradas()
        SINO
            retornar_error_401("Token inválido")
        FIN SI
    FIN SI

    // Base de Datos - Consulta con Filtro
    FUNCIÓN aplicar_filtro_estado(usuario_id, status_filter)
        SI status_filter NO ES NULL ENTONCES
            SELECT id, title, description, status, created_at, updated_at
            FROM tasks_task
            WHERE responsible_id = usuario_id AND status = status_filter
            ORDER BY created_at DESC
        SINO
            SELECT id, title, description, status, created_at, updated_at
            FROM tasks_task
            WHERE responsible_id = usuario_id
            ORDER BY created_at DESC
        FIN SI
        retornar_resultado_consulta()
    FIN FUNCIÓN
FIN
```

### 4. GESTIÓN DE SESIÓN

#### 4.1 Verificación de Token

```pseudocode
ALGORITMO: Verificación de Token JWT
ENTRADA: token_jwt
SALIDA: Usuario autenticado o error

INICIO
    // Frontend - Verificación en cada petición
    FUNCIÓN verificar_token_en_frontend()
        token = obtener_token_del_localStorage()
        SI token NO ES NULL ENTONCES
            configurar_headers_autorización(token)
            retornar VERDADERO
        SINO
            redirigir_a_login()
            retornar FALSO
        FIN SI
    FIN FUNCIÓN

    // Backend - Middleware de Autenticación
    FUNCIÓN verificar_token_en_backend(token)
        SI token NO ES NULL ENTONCES
            decodificar_token_jwt(token)
            SI token_válido Y NO_expirado ENTONCES
                obtener_usuario_del_token()
                retornar usuario
            SINO
                retornar_error_401("Token inválido o expirado")
            FIN SI
        SINO
            retornar_error_401("Token no proporcionado")
        FIN SI
    FIN FUNCIÓN
FIN
```

#### 4.2 Cierre de Sesión

```pseudocode
ALGORITMO: Cierre de Sesión
ENTRADA: token_jwt
SALIDA: Sesión cerrada

INICIO
    // Frontend - Botón de Logout
    SI usuario_hace_clic_en_logout ENTONCES
        eliminar_token_del_localStorage()
        limpiar_headers_autorización()
        redirigir_a_login()
    FIN SI

    // Backend - Invalidación de Token (Opcional)
    SI POST "/api/auth/logout/" ENTONCES
        verificar_token_jwt()
        SI token_válido ENTONCES
            agregar_token_a_lista_negra() // Opcional para invalidación
            retornar_confirmación_logout()
        SINO
            retornar_error_401("Token inválido")
        FIN SI
    FIN SI
FIN
```

## 🔄 Flujo Completo de Usuario

### Escenario: Usuario Completo Crea y Gestiona Tareas

```pseudocode
ALGORITMO: Flujo Completo de Usuario
INICIO
    // 1. Registro
    usuario_nuevo = registrar_usuario("john_doe", "john@example.com", "password123")
    SI registro_exitoso ENTONCES
        continuar_a_login()
    FIN SI

    // 2. Login
    sesión = iniciar_sesión("john_doe", "password123")
    SI login_exitoso ENTONCES
        token = obtener_token_jwt()
        guardar_token_en_localStorage(token)
        redirigir_a_página_tareas()
    FIN SI

    // 3. Crear Tarea
    nueva_tarea = crear_tarea("Completar proyecto", "Finalizar documentación del proyecto")
    SI tarea_creada_exitosamente ENTONCES
        mostrar_confirmación_creación()
        actualizar_lista_tareas()
    FIN SI

    // 4. Ver Tareas
    lista_tareas = obtener_tareas_usuario()
    SI lista_obtenida_exitosamente ENTONCES
        mostrar_tareas_en_interfaz(lista_tareas)
    FIN SI

    // 5. Editar Tarea
    tarea_actualizada = editar_tarea(tarea_id, "Completar proyecto", "Finalizar documentación y pruebas")
    SI tarea_actualizada_exitosamente ENTONCES
        mostrar_confirmación_actualización()
        actualizar_vista_tarea()
    FIN SI

    // 6. Marcar como Completada
    tarea_completada = marcar_tarea_completada(tarea_id)
    SI tarea_marcada_exitosamente ENTONCES
        mostrar_confirmación_completado()
        actualizar_estado_en_interfaz()
    FIN SI

    // 7. Filtrar Tareas
    tareas_pendientes = filtrar_tareas_por_estado("todo")
    SI filtro_aplicado_exitosamente ENTONCES
        mostrar_tareas_filtradas(tareas_pendientes)
    FIN SI

    // 8. Logout
    cerrar_sesión()
    SI logout_exitoso ENTONCES
        limpiar_datos_sesión()
        redirigir_a_login()
    FIN SI
FIN
```

## 🛡️ Validaciones y Seguridad

### Validaciones de Frontend

```pseudocode
ALGORITMO: Validaciones Frontend
INICIO
    // Validación de Formularios
    FUNCIÓN validar_formulario_registro(username, email, password)
        SI username.length < 3 ENTONCES
            retornar_error("Username debe tener al menos 3 caracteres")
        FIN SI

        SI email NO ES válido ENTONCES
            retornar_error("Email inválido")
        FIN SI

        SI password.length < 8 ENTONCES
            retornar_error("Password debe tener al menos 8 caracteres")
        FIN SI

        retornar VERDADERO
    FIN FUNCIÓN

    // Validación de Tareas
    FUNCIÓN validar_formulario_tarea(title, description)
        SI title.length < 1 ENTONCES
            retornar_error("Título es requerido")
        FIN SI

        SI title.length > 255 ENTONCES
            retornar_error("Título demasiado largo")
        FIN SI

        retornar VERDADERO
    FIN FUNCIÓN
FIN
```

### Validaciones de Backend

```pseudocode
ALGORITMO: Validaciones Backend
INICIO
    // Validación de Autenticación
    FUNCIÓN validar_autenticación(request)
        token = obtener_token_de_headers(request)
        SI token NO ES NULL ENTONCES
            usuario = verificar_token_jwt(token)
            SI usuario_válido ENTONCES
                retornar usuario
            SINO
                retornar_error_401("Token inválido")
            FIN SI
        SINO
            retornar_error_401("Token no proporcionado")
        FIN SI
    FIN FUNCIÓN

    // Validación de Propiedad
    FUNCIÓN validar_propiedad_tarea(task_id, usuario_id)
        tarea = obtener_tarea_por_id(task_id)
        SI tarea.responsible_id = usuario_id ENTONCES
            retornar VERDADERO
        SINO
            retornar FALSO
        FIN SI
    FIN FUNCIÓN
FIN
```

## 📊 Manejo de Errores

```pseudocode
ALGORITMO: Manejo de Errores
INICIO
    // Frontend - Interceptación de Errores
    FUNCIÓN manejar_error_api(error)
        SI error.status = 401 ENTONCES
            mostrar_error("Sesión expirada")
            redirigir_a_login()
        FIN SI

        SI error.status = 403 ENTONCES
            mostrar_error("Acceso denegado")
        FIN SI

        SI error.status = 404 ENTONCES
            mostrar_error("Recurso no encontrado")
        FIN SI

        SI error.status = 500 ENTONCES
            mostrar_error("Error del servidor")
        FIN SI

        mostrar_error_generico("Error inesperado")
    FIN FUNCIÓN

    // Backend - Respuestas de Error
    FUNCIÓN generar_respuesta_error(código, mensaje)
        retornar {
            "error": mensaje,
            "status": código,
            "timestamp": NOW()
        }
    FIN FUNCIÓN
FIN
```

## 🔄 Optimizaciones y Caching

```pseudocode
ALGORITMO: Optimizaciones de Rendimiento
INICIO
    // Frontend - Caching Local
    FUNCIÓN cachear_datos_usuario(usuario)
        localStorage.setItem("user_data", JSON.stringify(usuario))
    FIN FUNCIÓN

    // Backend - Paginación
    FUNCIÓN paginar_resultados(queryset, página, tamaño_página)
        offset = (página - 1) * tamaño_página
        limit = tamaño_página

        SELECT * FROM queryset
        LIMIT limit OFFSET offset

        retornar {
            "results": datos_paginados,
            "count": total_registros,
            "next": siguiente_página,
            "previous": página_anterior
        }
    FIN FUNCIÓN

    // Base de Datos - Índices
    CREAR_ÍNDICE idx_tasks_responsible ON tasks_task(responsible_id)
    CREAR_ÍNDICE idx_tasks_status ON tasks_task(status)
    CREAR_ÍNDICE idx_tasks_created ON tasks_task(created_at)
FIN
```

---

**Nota**: Este pseudocódigo describe el flujo completo de interacción entre las diferentes capas del sistema. Cada algoritmo puede ser implementado siguiendo las mejores prácticas de cada tecnología utilizada.
