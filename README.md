# Taskly — Task Management App

> 🇪🇸 [Leer en español](./README.es.md)

[![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk&logoColor=white)](https://openjdk.org)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./testing-app-movil/LICENSE)

**Taskly** is a mobile task-management application that consumes a REST backend with
persistent storage in MySQL. It is a straightforward, well-structured starting point
for a productivity app: create tasks, browse them by date, mark them as completed and
track your progress — all backed by a real database.

This repository is a **monorepo** containing both the mobile client and the backend API.

---

## Design / Mockups

The UI/UX is designed in Figma. You can review the mockups here:

**[Taskly — Figma Design](https://www.figma.com/design/1svjRo8ZtfiJJimHohVV9J/Testing-App?t=A6wCqv2DzLz1jmvw-1)**

---

## Features

| Status | Feature |
| :---: | :--- |
| ✅ | Splash screen and animated onboarding flow |
| ✅ | Login and registration validated against MySQL |
| ✅ | JWT authentication (Spring Security + BCrypt) |
| ✅ | Task list loaded from the MySQL database |
| ✅ | Create new tasks (persisted via the REST API) |
| ✅ | Mark tasks as completed / pending (toggle) |
| ✅ | Calendar view |
| ✅ | Statistics screen |
| ✅ | Settings with light / dark theme |
| 🚧 | Delete tasks from the UI (endpoint already exists on the backend) |

---

## Architecture

```
┌────────────────────┐        REST / JSON        ┌──────────────────┐        JPA        ┌─────────┐
│  Mobile (Expo/RN)  │  ⇄  /api/tasks  ⇄         │  Spring Boot API │  ⇄             ⇄  │  MySQL  │
└────────────────────┘                           └──────────────────┘                   └─────────┘
```

The mobile app consumes `http://<server-ip>:8080`. Navigation is state-driven inside
`App.tsx`. Users authenticate through `/api/auth/login` and every task request is sent
with `Authorization: Bearer <token>`. Tasks are fetched after a successful login and kept
in sync with the server on every mutation.

---

## Tech Stack

### Mobile (`testing-app-movil/`)

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| Expo | SDK 57 | Development platform and tooling |
| React Native | 0.86.3 | Cross-platform UI |
| React | 19.2.3 | UI library |
| TypeScript | ~6.0 | Static typing |
| react-native-svg | 15.15.4 | Icons |
| AsyncStorage | 2.2.0 | Local persistence |
| expo-status-bar | ~57.0.1 | Status bar control |

### Backend (`testing/`)

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| Spring Boot | 4.1.1 | REST API framework |
| Java | 21 | Language runtime |
| Spring Data JPA | (managed) | Data access layer |
| Spring Security + JWT | (managed) | Stateless authentication |
| Bean Validation | (managed) | DTO validation with `@Valid` |
| MySQL | 8 | Relational database |
| Lombok | (managed) | Boilerplate reduction |
| springdoc-openapi | 3.1.1 | OpenAPI 3 / Swagger UI docs |
| Maven | wrapper (`mvnw`) | Build tool |

---

## Repository Structure

```
testing-app/
├── testing-app-movil/          # Expo / React Native mobile client
│   ├── App.tsx                 # Entry point and state-driven navigation
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── constants/          # Initial/sample data
│   │   ├── context/            # Theme (light/dark) context
│   │   ├── screens/            # Splash, Onboarding, Login, Home, CreateTask...
│   │   ├── services/           # TaskService / AuthService (REST clients)
│   │   ├── types/              # Shared TypeScript types
│   │   └── utils/              # Date helpers
│   └── package.json
│
└── testing/                    # Spring Boot backend
    ├── database/
    │   └── seed_users.sql      # Manual MySQL user seed script
    ├── src/main/java/com/example/testing/
    │   ├── Controller/         # TaskController, AuthController
    │   ├── Dto/                # Login/Register DTOs and responses
    │   ├── Model/              # Task and User entities
    │   ├── Repository/         # TaskRepository, UserRepository (JPA)
    │   ├── Security/           # JwtService, JWT filter, SecurityConfig
    │   ├── Service/            # TaskService, AuthService
    │   └── config/             # DataInitializer (task seed data)
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

---

## API Endpoints

Base URL: `http://<server-ip>:8080`

### Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a user and return a JWT |
| `POST` | `/api/auth/login` | Validate credentials and return a JWT |

### Tasks

All task endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | List all tasks (ordered by date and time) |
| `GET` | `/api/tasks/{id}` | Get a single task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/{id}` | Update an existing task |
| `PATCH` | `/api/tasks/{id}/toggle` | Toggle completed / pending |
| `DELETE` | `/api/tasks/{id}` | Delete a task |

---

## API Documentation (OpenAPI / Swagger)

The REST API is documented with **OpenAPI 3** using
[springdoc-openapi](https://springdoc.org). With the backend running you get:

- **Swagger UI (interactive):** <http://localhost:8080/swagger-ui.html>
- **OpenAPI contract (JSON):** <http://localhost:8080/v3/api-docs>
- **OpenAPI contract (YAML):** <http://localhost:8080/v3/api-docs.yaml>

Swagger UI lets you explore and test every endpoint straight from the browser.

---

## Data Model

`Task` entity (`tasks` table):

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `Long` | Auto-generated primary key |
| `title` | `String` | Task title (required) |
| `description` | `String` | Optional details |
| `date` | `LocalDate` | Due date (required) |
| `time` | `LocalTime` | Due time (required) |
| `priority` | `String` | `Baja` \| `Media` \| `Alta` |
| `category` | `String` | `General` \| `Estudio` \| `Trabajo` \| `Personal` |
| `completed` | `boolean` | Completion state |
| `repeat` | `boolean` | Recurring task flag |

`User` entity (`users` table):

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `Long` | Auto-generated primary key |
| `name` | `String` | Display name |
| `email` | `String` | Unique login email |
| `password` | `String` | BCrypt password hash |
| `role` | `String` | `USER` \| `ADMIN` |

---

## Prerequisites

- **Node.js** 18+ and npm
- **Expo** tooling (`npx expo`)
- **JDK 21**
- **Maven** (the `mvnw` wrapper is included)
- **MySQL** 8 running locally

---

## Getting Started

### 1. Backend (Spring Boot + MySQL)

Create the database:

```sql
CREATE DATABASE taskly_db;
```

Configure the connection in `testing/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskly_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

Set the JWT secret (at least 32 characters) before starting the API:

```powershell
$env:JWT_SECRET = "change-this-to-a-long-random-secret"
```

```bash
export JWT_SECRET="change-this-to-a-long-random-secret"
```

Load the sample users manually (they are **not** seeded by Java):

```bash
mysql -u root -p taskly_db < testing/database/seed_users.sql
```

Run the API:

```bash
cd testing
./mvnw spring-boot:run
```

The server starts on `http://localhost:8080`. On first run, `DataInitializer` seeds
5 sample tasks into the database. Users come only from `database/seed_users.sql`.

### 2. Mobile app (Expo)

Install dependencies and set the backend IP the app should reach. In
`testing-app-movil/src/services/api.ts`:

```ts
const SERVER_IP = "192.168.100.11"; // <-- use your machine's LAN IP
```

Then start the app:

```bash
cd testing-app-movil
npm install
npx expo start
```

> The phone/emulator must be on the same network as the backend and able to reach
> port `8080`. Use your machine's LAN IP (not `localhost`) so a physical device can
> connect.

---

## Roadmap

Planned and upcoming work:

- [x] **Per-user validated login** — JWT authentication with login and registration.
- [ ] **Delete tasks from the UI** — the backend endpoint already exists; wire it into the app.
- [ ] Task editing and better filtering / search.
- [ ] Notifications and reminders for scheduled tasks.
- [ ] Multi-user support (tasks owned by each user).

---

## License

Distributed under the MIT License. See [`testing-app-movil/LICENSE`](./testing-app-movil/LICENSE) for details.
