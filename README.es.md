# Taskly — App de Gestión de Tareas
 
> 🇬🇧 [Read in English](./README.md)
 
[![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk&logoColor=white)](https://openjdk.org)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./testing-app-movil/LICENSE)
 
**Taskly** es una aplicación móvil de gestión de tareas que consume un backend REST con
almacenamiento persistente en MySQL. Es un punto de partida sencillo y bien estructurado
para una app de productividad: regístrate, crea tareas, edítalas y búscalas, consúltalas
por fecha, márcalas como completadas y sigue tu progreso, todo respaldado por una base de
datos real y separado por usuario.
 
Este repositorio es un **monorepo** que contiene tanto el cliente móvil como la API backend.
 
---
 
## Diseño / Mockups
 
La interfaz está diseñada en Figma. Puedes revisar los mockups aquí:
 
**[Taskly — Diseño en Figma](https://www.figma.com/design/1svjRo8ZtfiJJimHohVV9J/Testing-App?t=A6wCqv2DzLz1jmvw-1)**
 
---
 
## Funcionalidades
 
| Estado | Funcionalidad |
| :---: | :--- |
| ✅ | Pantalla de bienvenida (splash) y onboarding animado |
| ✅ | Inicio de sesión y registro validados contra MySQL |
| ✅ | Autenticación JWT (Spring Security + BCrypt) |
| ✅ | Multiusuario: cada usuario solo ve y gestiona sus propias tareas |
| ✅ | Crear, editar y eliminar tareas (persistidas mediante la API REST) |
| ✅ | Marcar tareas como completadas / pendientes (toggle) |
| ✅ | Búsqueda por texto (título / descripción) y filtro por estado |
| ✅ | Selectores nativos de fecha y hora |
| ✅ | Saludo personalizado con el nombre del usuario que inició sesión |
| ✅ | Vista de calendario |
| ✅ | Pantalla de estadísticas |
| ✅ | Ajustes con tema claro / oscuro |
 
---
 
## Arquitectura
 
```
┌────────────────────┐        REST / JSON        ┌──────────────────┐        JPA        ┌─────────┐
│  Móvil (Expo/RN)   │  ⇄  /api/tasks  ⇄         │  API Spring Boot │  ⇄             ⇄  │  MySQL  │
└────────────────────┘                           └──────────────────┘                   └─────────┘
```
 
La app móvil consume `http://<ip-del-servidor>:8080`. La navegación se maneja por estado
dentro de `App.tsx`. Los usuarios se autentican mediante `/api/auth/login` y cada petición
de tareas se envía con `Authorization: Bearer <token>`.
 
El backend nunca confía en el cliente para saber quién es el usuario: el dueño de la tarea
siempre se obtiene del JWT. Las tareas se cargan tras un inicio de sesión exitoso y se
mantienen sincronizadas con el servidor en cada modificación.
 
---
 
## Stack Tecnológico
 
### Móvil (`testing-app-movil/`)
 
| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| Expo | SDK 57 | Plataforma y herramientas de desarrollo |
| React Native | 0.86.3 | Interfaz multiplataforma |
| React | 19.2.3 | Librería de UI |
| TypeScript | ~6.0 | Tipado estático |
| react-native-svg | 15.15.4 | Iconos |
| AsyncStorage | 2.2.0 | Persistencia local (sesión y token) |
| @react-native-community/datetimepicker | (gestionada por Expo) | Selectores nativos de fecha / hora |
| expo-status-bar | ~57.0.1 | Control de la barra de estado |
 
### Backend (`testing/`)
 
| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| Spring Boot | 4.1.1 | Framework de la API REST |
| Java | 21 | Entorno de ejecución |
| Spring Data JPA | (gestionada) | Capa de acceso a datos |
| Spring Security + JWT | (gestionada) | Autenticación sin estado |
| Bean Validation | (gestionada) | Validación de DTOs con `@Valid` |
| MySQL | 8 | Base de datos relacional |
| Lombok | (gestionada) | Reducción de código repetitivo |
| springdoc-openapi | 3.1.1 | Documentación OpenAPI 3 / Swagger UI |
| Maven | wrapper (`mvnw`) | Herramienta de compilación |
 
---
 
## Estructura del Repositorio
 
```
testing-app/
├── testing-app-movil/          # Cliente móvil Expo / React Native
│   ├── App.tsx                 # Punto de entrada y navegación por estado
│   ├── .env.example            # Plantilla para la URL de la API
│   ├── src/
│   │   ├── components/         # Componentes reutilizables (TaskRow, Button, Field...)
│   │   ├── constants/          # Datos iniciales / de ejemplo
│   │   ├── context/            # Contexto de tema (claro/oscuro)
│   │   ├── screens/            # Splash, Onboarding, Login, Home, CreateTask (crear + editar)...
│   │   ├── services/           # TaskService / AuthService (clientes REST)
│   │   ├── types/              # Tipos TypeScript compartidos
│   │   └── utils/              # Utilidades de fechas
│   └── package.json
│
└── testing/                    # Backend Spring Boot
    ├── database/
    │   └── seed_users.sql      # Script manual para cargar usuarios en MySQL
    ├── src/main/java/com/example/testing/
    │   ├── Controller/         # TaskController, AuthController, GlobalExceptionHandler
    │   ├── Dto/                # DTOs de autenticación, TaskRequest, TaskResponse, UserResponse
    │   ├── Model/              # Entidades Task y User
    │   ├── Repository/         # TaskRepository, UserRepository (JPA)
    │   ├── Security/           # JwtService, filtro JWT, SecurityConfig
    │   ├── Service/            # TaskService, AuthService
    │   └── config/             # DataInitializer (tareas de ejemplo), OpenApiConfig
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```
 
---
 
## Endpoints de la API
 
URL base: `http://<ip-del-servidor>:8080`
 
### Autenticación
 
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registra un usuario y devuelve un JWT |
| `POST` | `/api/auth/login` | Valida credenciales y devuelve un JWT |
 
La respuesta contiene el token y los datos públicos del usuario (`id`, `name`, `email`, `role`).
 
### Tareas
 
Todos los endpoints de tareas requieren `Authorization: Bearer <token>` y solo operan sobre
**las tareas del usuario autenticado**. Pedir una tarea que pertenece a otro usuario
devuelve `404`.
 
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Lista mis tareas (ordenadas por fecha y hora) |
| `GET` | `/api/tasks/{id}` | Obtiene una de mis tareas por ID |
| `POST` | `/api/tasks` | Crea una tarea (el dueño se toma del JWT) |
| `PUT` | `/api/tasks/{id}` | Actualiza una de mis tareas |
| `PATCH` | `/api/tasks/{id}/toggle` | Alterna completada / pendiente |
| `DELETE` | `/api/tasks/{id}` | Elimina una de mis tareas |
 
---
 
## Documentación de la API (OpenAPI / Swagger)
 
La API REST está documentada con **OpenAPI 3** mediante
[springdoc-openapi](https://springdoc.org). Con el backend en ejecución dispones de:
 
- **Swagger UI (interactivo):** <http://localhost:8080/swagger-ui.html>
- **Contrato OpenAPI (JSON):** <http://localhost:8080/v3/api-docs>
- **Contrato OpenAPI (YAML):** <http://localhost:8080/v3/api-docs.yaml>
Swagger UI permite explorar y probar cada endpoint directamente desde el navegador. Usa el
botón **Authorize** con un token obtenido de `/api/auth/login`.
 
---
 
## Modelo de Datos
 
Entidad `Task` (tabla `tasks`):
 
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Long` | Clave primaria autogenerada |
| `title` | `String` | Título de la tarea (obligatorio) |
| `description` | `String` | Detalles opcionales |
| `date` | `LocalDate` | Fecha límite (obligatoria) |
| `time` | `LocalTime` | Hora límite (obligatoria) |
| `priority` | `String` | `Baja` \| `Media` \| `Alta` |
| `category` | `String` | `General` \| `Estudio` \| `Trabajo` \| `Personal` |
| `completed` | `boolean` | Estado de completado |
| `repeat` | `boolean` | Indica si la tarea se repite |
| `user` | `User` | Dueño de la tarea (clave foránea `user_id`, `@ManyToOne`) |
 
> El dueño nunca lo envía el cliente: el backend lo obtiene del JWT.
> Las respuestas usan DTOs `TaskResponse`, por lo que los datos del usuario (como el hash de la contraseña) nunca se exponen.
 
Entidad `User` (tabla `users`):
 
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Long` | Clave primaria autogenerada |
| `name` | `String` | Nombre a mostrar |
| `email` | `String` | Correo único de inicio de sesión |
| `password` | `String` | Hash BCrypt de la contraseña |
| `role` | `String` | `USER` \| `ADMIN` |
 
---
 
## Requisitos Previos
 
- **Node.js** 18+ y npm
- Herramientas de **Expo** (`npx expo`)
- **JDK 21**
- **Maven** (se incluye el wrapper `mvnw`)
- **MySQL** 8 ejecutándose localmente
---
 
## Puesta en Marcha
 
### 1. Backend (Spring Boot + MySQL)
 
Crea la base de datos:
 
```sql
CREATE DATABASE taskly_db;
```
 
La conexión se configura en `testing/src/main/resources/application.properties`
mediante variables de entorno, de modo que no se guarda nada sensible en el repositorio:
 
```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/taskly_db?useSSL=false&serverTimezone=UTC}
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD}
```
 
Define las variables de entorno antes de iniciar la API (`JWT_SECRET` debe tener al
menos 32 caracteres):
 
```powershell
$env:DB_PASSWORD = "tu-clave-de-mysql"
$env:JWT_SECRET  = "cambia-esto-por-un-secreto-largo-y-aleatorio"
```
 
```bash
export DB_PASSWORD="tu-clave-de-mysql"
export JWT_SECRET="cambia-esto-por-un-secreto-largo-y-aleatorio"
```
 
> En IntelliJ IDEA: *Run → Edit Configurations → Environment variables*.
 
Carga **primero** los usuarios de ejemplo (Java **no** los inserta automáticamente):
 
```bash
mysql -u root -p taskly_db < testing/database/seed_users.sql
```
 
Luego ejecuta la API:
 
```bash
cd testing
./mvnw spring-boot:run
```
 
El servidor arranca en `http://localhost:8080`. En la primera ejecución, `DataInitializer`
inserta 5 tareas de ejemplo (3 para `ana@taskly.com` y 2 para `luis@taskly.com`). Si esos
usuarios aún no existen, se omite la carga y se muestra una advertencia; basta con reiniciar
la API después de cargar `seed_users.sql`.
 
> **Cuentas de demostración** (solo desarrollo): `admin@taskly.com`, `ana@taskly.com` y
> `luis@taskly.com`, con las contraseñas indicadas en `seed_users.sql`.
> Cámbialas (sobre todo la de admin) antes de cualquier despliegue real.
 
### 2. App móvil (Expo)
 
Instala las dependencias:
 
```bash
cd testing-app-movil
npm install
```
 
Crea un archivo `.env` (cópialo desde `.env.example`) con la URL del backend:
 
```
EXPO_PUBLIC_API_URL=http://192.168.x.x:8080
```
 
Usa la IP de tu máquina en la red local, **no** `localhost`, para que un dispositivo físico
pueda conectarse. El teléfono o emulador debe estar en la misma red que el backend y poder
alcanzar el puerto `8080`.
 
Inicia la app (la opción `-c` limpia la caché para que Expo lea la variable):
 
```bash
npx expo start -c
```
 
> Toda variable que empiece con `EXPO_PUBLIC_` queda incluida dentro de la app. Úsala solo
> para URLs, nunca para claves privadas.
 
---
 
## Probar el Comportamiento Multiusuario
 
1. Inicia sesión con `ana@taskly.com` → deberías ver **3 tareas** y el saludo *"Hola, Ana"*.
2. Cierra sesión e inicia con `luis@taskly.com` → deberías ver **2 tareas**.
3. Con el token de Luis, llama a `GET /api/tasks/{id}` usando el ID de una tarea de Ana →
   la API debe responder **404**.
---
 
## Hoja de Ruta
 
Completado:
 
- [x] **Login validado por usuario** — autenticación JWT con inicio de sesión y registro.
- [x] **Eliminar tareas desde la UI** — conectado al endpoint del backend.
- [x] **Edición y búsqueda de tareas** — edición de todos los campos; búsqueda por texto y filtro por estado.
- [x] **Soporte multiusuario** — cada tarea pertenece a un usuario.
Planificado:
 
- [ ] Filtros por prioridad y categoría.
- [ ] HTTPS y CORS restringido para producción.
- [ ] Migraciones de base de datos (Flyway) y pruebas automatizadas.
---
 
## Licencia
 
Distribuido bajo la Licencia MIT. Consulta [`testing-app-movil/LICENSE`](./testing-app-movil/LICENSE) para más detalles.
 