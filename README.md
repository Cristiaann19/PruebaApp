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
for a productivity app: sign up, create tasks, edit and search them, browse them by
date, mark them as completed and track your progress — all backed by a real database
and scoped per user.
 
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
| ✅ | Multi-user: each user only sees and manages their own tasks |
| ✅ | Create, edit and delete tasks (persisted via the REST API) |
| ✅ | Mark tasks as completed / pending (toggle) |
| ✅ | Search by text (title / description) and filter by status |
| ✅ | Native date and time pickers |
| ✅ | Personalized greeting with the logged-in user's name |
| ✅ | Calendar view |
| ✅ | Statistics screen |
| ✅ | Settings with light / dark theme |
 
---
 
## Architecture
 
```
┌────────────────────┐        REST / JSON        ┌──────────────────┐        JPA        ┌─────────┐
│  Mobile (Expo/RN)  │  ⇄  /api/tasks  ⇄         │  Spring Boot API │  ⇄             ⇄  │  MySQL  │
└────────────────────┘                           └──────────────────┘                   └─────────┘
```
 
The mobile app consumes `http://<server-ip>:8080`. Navigation is state-driven inside
`App.tsx`. Users authenticate through `/api/auth/login`, and every task request is sent
with `Authorization: Bearer <token>`.
 
The backend never trusts the client to say who the user is: the task owner is always
read from the JWT. Tasks are fetched after a successful login and kept in sync with the
server on every mutation.
 
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
| AsyncStorage | 2.2.0 | Local persistence (session and token) |
| @react-native-community/datetimepicker | (managed by Expo) | Native date / time pickers |
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
│   ├── .env.example            # Template for the API URL
│   ├── src/
│   │   ├── components/         # Reusable UI components (TaskRow, Button, Field...)
│   │   ├── constants/          # Initial/sample data
│   │   ├── context/            # Theme (light/dark) context
│   │   ├── screens/            # Splash, Onboarding, Login, Home, CreateTask (create + edit)...
│   │   ├── services/           # TaskService / AuthService (REST clients)
│   │   ├── types/              # Shared TypeScript types
│   │   └── utils/              # Date helpers
│   └── package.json
│
└── testing/                    # Spring Boot backend
    ├── database/
    │   └── seed_users.sql      # Manual MySQL user seed script
    ├── src/main/java/com/example/testing/
    │   ├── Controller/         # TaskController, AuthController, GlobalExceptionHandler
    │   ├── Dto/                # Auth DTOs, TaskRequest, TaskResponse, UserResponse
    │   ├── Model/              # Task and User entities
    │   ├── Repository/         # TaskRepository, UserRepository (JPA)
    │   ├── Security/           # JwtService, JWT filter, SecurityConfig
    │   ├── Service/            # TaskService, AuthService
    │   └── config/             # DataInitializer (task seed data), OpenApiConfig
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
 
The response contains the token and the user's public data (`id`, `name`, `email`, `role`).
 
### Tasks
 
All task endpoints require `Authorization: Bearer <token>` and only operate on the
**authenticated user's own tasks**. Requesting a task that belongs to another user
returns `404`.
 
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | List my tasks (ordered by date and time) |
| `GET` | `/api/tasks/{id}` | Get one of my tasks by ID |
| `POST` | `/api/tasks` | Create a task (the owner is taken from the JWT) |
| `PUT` | `/api/tasks/{id}` | Update one of my tasks |
| `PATCH` | `/api/tasks/{id}/toggle` | Toggle completed / pending |
| `DELETE` | `/api/tasks/{id}` | Delete one of my tasks |
 
---
 
## API Documentation (OpenAPI / Swagger)
 
The REST API is documented with **OpenAPI 3** using
[springdoc-openapi](https://springdoc.org). With the backend running you get:
 
- **Swagger UI (interactive):** <http://localhost:8080/swagger-ui.html>
- **OpenAPI contract (JSON):** <http://localhost:8080/v3/api-docs>
- **OpenAPI contract (YAML):** <http://localhost:8080/v3/api-docs.yaml>
Swagger UI lets you explore and test every endpoint straight from the browser. Use the
**Authorize** button with a token obtained from `/api/auth/login`.
 
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
| `user` | `User` | Owner of the task (`user_id` foreign key, `@ManyToOne`) |
 
> The owner is never sent by the client: the backend reads it from the JWT.
> Responses use `TaskResponse` DTOs, so user data (such as the password hash) is never exposed.
 
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
 
The connection is configured in `testing/src/main/resources/application.properties`
using environment variables, so nothing sensitive is stored in the repository:
 
```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/taskly_db?useSSL=false&serverTimezone=UTC}
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD}
```
 
Set the environment variables before starting the API (`JWT_SECRET` must have at
least 32 characters):
 
```powershell
$env:DB_PASSWORD = "your-mysql-password"
$env:JWT_SECRET  = "change-this-to-a-long-random-secret"
```
 
```bash
export DB_PASSWORD="your-mysql-password"
export JWT_SECRET="change-this-to-a-long-random-secret"
```
 
> In IntelliJ IDEA: *Run → Edit Configurations → Environment variables*.
 
Load the sample users **first** (they are **not** seeded by Java):
 
```bash
mysql -u root -p taskly_db < testing/database/seed_users.sql
```
 
Then run the API:
 
```bash
cd testing
./mvnw spring-boot:run
```
 
The server starts on `http://localhost:8080`. On first run, `DataInitializer` seeds
5 sample tasks (3 for `ana@taskly.com` and 2 for `luis@taskly.com`). If those users
don't exist yet, the seed is skipped and a warning is printed; just restart the API
after loading `seed_users.sql`.
 
> **Demo accounts** (development only): `admin@taskly.com`, `ana@taskly.com` and
> `luis@taskly.com`, with the passwords listed in `seed_users.sql`.
> Change them (especially the admin) before any real deployment.
 
### 2. Mobile app (Expo)
 
Install the dependencies:
 
```bash
cd testing-app-movil
npm install
```
 
Create a `.env` file (copy it from `.env.example`) with the backend URL:
 
```
EXPO_PUBLIC_API_URL=http://192.168.x.x:8080
```
 
Use your machine's LAN IP, **not** `localhost`, so a physical device can connect.
The phone/emulator must be on the same network as the backend and able to reach
port `8080`.
 
Start the app (the `-c` flag clears the cache so Expo picks up the variable):
 
```bash
npx expo start -c
```
 
> Every variable starting with `EXPO_PUBLIC_` is bundled into the app. Use it for
> URLs only, never for private keys.
 
---
 
## Testing the Multi-user Behavior
 
1. Log in as `ana@taskly.com` → you should see **3 tasks** and the greeting *"Hola, Ana"*.
2. Log out and log in as `luis@taskly.com` → you should see **2 tasks**.
3. With Luis's token, call `GET /api/tasks/{id}` using the ID of one of Ana's tasks →
   the API must answer **404**.
---
 
## Roadmap
 
Completed:
 
- [x] **Per-user validated login** — JWT authentication with login and registration.
- [x] **Delete tasks from the UI** — wired to the backend endpoint.
- [x] **Task editing and search** — edit all fields; search by text and filter by status.
- [x] **Multi-user support** — tasks owned by each user.
Planned:
 
- [ ] Filter by priority and category.
- [ ] HTTPS and restricted CORS for production.
- [ ] Database migrations (Flyway) and automated tests.
---
 
## License
 
Distributed under the MIT License. See [`testing-app-movil/LICENSE`](./testing-app-movil/LICENSE) for details.