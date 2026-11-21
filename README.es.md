# Taskly — App de gestión de tareas

> 🇬🇧 [Read in English](./README.md)

[![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk&logoColor=white)](https://openjdk.org)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./testing-app-movil/LICENSE)

**Taskly** es una aplicación móvil de gestión de tareas que consume un backend REST con
persistencia en MySQL. Es un punto de partida simple y bien estructurado para una app de
productividad: crear tareas, verlas por fecha, marcarlas como completadas y seguir tu
progreso — todo respaldado por una base de datos real.

Este repositorio es un **monorepo** que contiene tanto el cliente móvil como la API backend.

---

## Diseño / Mockups

La interfaz está diseñada en Figma. Puedes revisar los mockups aquí:

**[Taskly — Diseño en Figma](https://www.figma.com/design/1svjRo8ZtfiJJimHohVV9J/Testing-App?t=A6wCqv2DzLz1jmvw-1)**

---

## Características

| Estado | Característica |
| :---: | :--- |
| ✅ | Splash screen y flujo de onboarding |
| ✅ | Login y registro validados contra MySQL |
| ✅ | Autenticación con JWT (Spring Security + BCrypt) |
| ✅ | Lista de tareas cargada desde la base de datos MySQL |
| ✅ | Crear nuevas tareas (persistidas vía la API REST) |
| ✅ | Marcar tareas como completadas / pendientes (toggle) |
| ✅ | Vista de calendario |
| ✅ | Pantalla de estadísticas |
| ✅ | Ajustes con tema claro / oscuro |
| 🚧 | Eliminación de tareas desde la interfaz (el endpoint ya existe en el backend) |

---

## Arquitectura

```
┌────────────────────┐      REST / JSON      ┌──────────────────┐       JPA        ┌─────────┐
│  Móvil (Expo/RN)   │  ⇄  /api/tasks  ⇄     │  API Spring Boot │  ⇄            ⇄  │  MySQL  │
└────────────────────┘                       └──────────────────┘                  └─────────┘
```

La app móvil consume `http://<ip-servidor>:8080`. La navegación está basada en estado
dentro de `App.tsx`. Los usuarios se autentican con `/api/auth/login` y cada petición de
tareas se envía con `Authorization: Bearer <token>`. Las tareas se obtienen tras un login
correcto y se sincronizan con el servidor en cada modificación.

---

## Stack tecnológico

### Móvil (`testing-app-movil/`)

| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| Expo | SDK 57 | Plataforma y herramientas de desarrollo |
| React Native | 0.86.3 | Interfaz multiplataforma |
| React | 19.2.3 | Librería de UI |
| TypeScript | ~6.0 | Tipado estático |
| react-native-svg | 15.15.4 | Iconos |
| AsyncStorage | 2.2.0 | Persistencia local |
| expo-status-bar | ~57.0.1 | Control de la barra de estado |

### Backend (`testing/`)

| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| Spring Boot | 4.1.1 | Framework de la API REST |
| Java | 21 | Runtime del lenguaje |
| Spring Data JPA | (gestionado) | Capa de acceso a datos |
| Spring Security + JWT | (gestionado) | Autenticación stateless |
| Bean Validation | (gestionado) | Validación de DTOs con `@Valid` |
| MySQL | 8 | Base de datos relacional |
| Lombok | (gestionado) | Reducción de boilerplate |
| springdoc-openapi | 3.1.1 | Documentación OpenAPI 3 / Swagger UI |
| Maven | wrapper (`mvnw`) | Herramienta de build |

---

## Estructura del repositorio

```
testing-app/
├── testing-app-movil/          # Cliente móvil Expo / React Native
│   ├── App.tsx                 # Punto de entrada y navegación por estado
│   ├── src/
│   │   ├── components/         # Componentes de UI reutilizables
│   │   ├── constants/          # Datos iniciales / de ejemplo
│   │   ├── context/            # Contexto de tema (claro/oscuro)
│   │   ├── screens/            # Splash, Onboarding, Login, Home, CreateTask...
│   │   ├── services/           # TaskService / AuthService (clientes REST)
│   │   ├── types/              # Tipos TypeScript compartidos
│   │   └── utils/              # Utilidades de fechas
│   └── package.json
│
└── testing/                    # Backend Spring Boot
    ├── database/
    │   └── seed_users.sql      # Script manual de usuarios para MySQL
    ├── src/main/java/com/example/testing/
    │   ├── Controller/         # TaskController, AuthController
    │   ├── Dto/                # DTOs de login/registro y respuestas
    │   ├── Model/              # Entidades Task y User
    │   ├── Repository/         # TaskRepository, UserRepository (JPA)
    │   ├── Security/           # JwtService, filtro JWT, SecurityConfig
    │   ├── Service/            # TaskService, AuthService
    │   └── config/             # DataInitializer (datos de tareas)
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

---

## Endpoints de la API

URL base: `http://<ip-servidor>:8080`

### Autenticación

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registra un usuario y devuelve un JWT |
| `POST` | `/api/auth/login` | Valida credenciales y devuelve un JWT |

### Tareas

Todos los endpoints de tareas requieren `Authorization: Bearer <token>`.

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Lista todas las tareas (ordenadas por fecha y hora) |
| `GET` | `/api/tasks/{id}` | Obtiene una tarea por su ID |
| `POST` | `/api/tasks` | Crea una nueva tarea |
| `PUT` | `/api/tasks/{id}` | Actualiza una tarea existente |
| `PATCH` | `/api/tasks/{id}/toggle` | Alterna completada / pendiente |
| `DELETE` | `/api/tasks/{id}` | Elimina una tarea |

---

## Documentación de la API (OpenAPI / Swagger)

La API REST está documentada con **OpenAPI 3** usando
[springdoc-openapi](https://springdoc.org). Con el backend en ejecución obtienes:

- **Swagger UI (interactiva):** <http://localhost:8080/swagger-ui.html>
- **Contrato OpenAPI (JSON):** <http://localhost:8080/v3/api-docs>
- **Contrato OpenAPI (YAML):** <http://localhost:8080/v3/api-docs.yaml>

Swagger UI te permite explorar y probar cada endpoint directamente desde el navegador.

---

## Modelo de datos

Entidad `Task` (tabla `tasks`):

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Long` | Clave primaria autogenerada |
| `title` | `String` | Título de la tarea (obligatorio) |
| `description` | `String` | Detalles opcionales |
| `date` | `LocalDate` | Fecha de vencimiento (obligatoria) |
| `time` | `LocalTime` | Hora de vencimiento (obligatoria) |
| `priority` | `String` | `Baja` \| `Media` \| `Alta` |
| `category` | `String` | `General` \| `Estudio` \| `Trabajo` \| `Personal` |
| `completed` | `boolean` | Estado de finalización |
| `repeat` | `boolean` | Marca de tarea recurrente |

Entidad `User` (tabla `users`):

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `Long` | Clave primaria autogenerada |
| `name` | `String` | Nombre visible |
| `email` | `String` | Correo de login único |
| `password` | `String` | Hash BCrypt de la contraseña |
| `role` | `String` | `USER` \| `ADMIN` |

---

## Requisitos previos

- **Node.js** 18+ y npm
- **Expo** (`npx expo`)
- **JDK 21**
- **Maven** (se incluye el wrapper `mvnw`)
- **MySQL** 8 ejecutándose localmente

---

## Puesta en marcha

### 1. Backend (Spring Boot + MySQL)

Crea la base de datos:

```sql
CREATE DATABASE taskly_db;
```

Configura la conexión en `testing/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskly_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD
```

Define el secreto JWT (mínimo 32 caracteres) antes de arrancar la API:

```powershell
$env:JWT_SECRET = "cambia-esto-por-un-secreto-largo-y-aleatorio"
```

```bash
export JWT_SECRET="cambia-esto-por-un-secreto-largo-y-aleatorio"
```

Carga los usuarios de ejemplo manualmente (**no** se inicializan desde Java):

```bash
mysql -u root -p taskly_db < testing/database/seed_users.sql
```

Ejecuta la API:

```bash
cd testing
./mvnw spring-boot:run
```

El servidor arranca en `http://localhost:8080`. En la primera ejecución,
`DataInitializer` inserta 5 tareas de ejemplo en la base de datos. Los usuarios
provienen únicamente de `database/seed_users.sql`.

### 2. App móvil (Expo)

Instala las dependencias y define la IP del backend a la que se conectará la app. En
`testing-app-movil/src/services/api.ts`:

```ts
const SERVER_IP = "192.168.100.11"; // <-- usa la IP LAN de tu máquina
```

Luego inicia la app:

```bash
cd testing-app-movil
npm install
npx expo start
```

> El teléfono/emulador debe estar en la misma red que el backend y poder alcanzar el
> puerto `8080`. Usa la IP LAN de tu máquina (no `localhost`) para que un dispositivo
> físico pueda conectarse.

---

## Roadmap

Trabajo planificado y próximo:

- [x] **Login validado por usuario** — autenticación con JWT, login y registro.
- [ ] **Eliminación de tareas desde la interfaz** — el endpoint ya existe en el backend; falta conectarlo en la app.
- [ ] Edición de tareas y mejor filtrado / búsqueda.
- [ ] Notificaciones y recordatorios para tareas programadas.
- [x] Soporte multiusuario (tareas asociadas a cada usuario).

---

## Licencia

Distribuido bajo la Licencia MIT. Consulta [`testing-app-movil/LICENSE`](./testing-app-movil/LICENSE) para más detalles.
