# ADR-001: Base de dades del projecte

## Context

Necessitem una base de dades per guardar usuaris, productes, categories i comandes.
Volem que sigui flexible, ja que al principi encara no sabem tots els camps que
tindran els productes i aixi podem afegir-ne de nous sense canviar tota l'estructura.

## Decisió

Farem servir MongoDB 8. Va dins d'un contenidor Docker amb docker-compose.
L'usuari i la contrasenya estan al fitxer .env, que no es puja al repo.
Per veure les dades fem servir MongoDB Compass.

## Conseqüències

- (+) Podem afegir camps nous als productes sense fer migracions.
- (+) Els documents son com un JSON, aixi que encaixa molt be amb Node/Express.
- (+) Amb Docker tots tenim la mateixa versio de Mongo i s'arrenca amb docker compose up.
- (-) Les consultes amb moltes relacions (com els JOIN de SQL) son mes complicades.
- (-) Com que es tan flexible, hem de vigilar que les dades no quedin desordenades.
