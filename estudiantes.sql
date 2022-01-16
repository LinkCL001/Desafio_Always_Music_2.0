CREATE DATABASE estudiantes;

CREATE TABLE estudiantes(
    nombre VARCHAR(15) NOT NULL,
    rut VARCHAR(12),
    curso VARCHAR(15) NOT NULL,
    nivel INT NOT NULL,
    PRIMARY KEY (rut)
);

