-- Taskly - carga inicial de usuarios
-- Ejecutar manualmente en MySQL; Spring no lo inicializa automaticamente.
--
-- Uso:
--   mysql -u root -p taskly_db < database/seed_users.sql
--
-- Credenciales de ejemplo (cambiar en produccion):
--   admin@taskly.com / Admin1234!
--   ana@taskly.com   / Taskly1234
--   luis@taskly.com  / Taskly1234
--
-- Las contrasenas estan guardadas como hashes BCrypt, nunca en texto plano.

CREATE DATABASE IF NOT EXISTS taskly_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE taskly_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- La entidad Person fue eliminada: su tabla ya no se usa.
DROP TABLE IF EXISTS persons;

INSERT IGNORE INTO users (name, email, password, role) VALUES
    (
        'Administrador',
        'admin@taskly.com',
        '$2a$10$IYZjN9ejlFNt5fcUAhb8NOjXgccM4wV2.2oj3Ze7jSn.x1oVOab5G',
        'ADMIN'
    ),
    (
        'Ana Torres',
        'ana@taskly.com',
        '$2a$10$1n3e1zOwVs/bxO0ssEY7..w03ysWLKg2ybkNoMVmAWrwz3zOgMfW2',
        'USER'
    ),
    (
        'Luis Perez',
        'luis@taskly.com',
        '$2a$10$1n3e1zOwVs/bxO0ssEY7..w03ysWLKg2ybkNoMVmAWrwz3zOgMfW2',
        'USER'
    );
