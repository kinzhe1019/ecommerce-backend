# ADR-002: Estructura inicial del projecte

## Context

El projecte te dues parts amb tecnologies diferents: el frontend amb React i el
backend amb Node/Express. Hem de decidir si ho posem tot en un sol repo (monorepo)
o en dos repos separats.

## Decisió

Farem servir dos repos separats a GitHub, ja que son dues parts molt diferents:

- ecommerce-frontend: l'aplicacio de React.
- ecommerce-backend: l'API amb Node/Express i la documentacio del projecte (/docs).

## Conseqüències

- (+) Cada part te les seves dependencies (package.json) i el seu historial de commits.
- (+) Es poden desplegar per separat, i si canvio alguna cosa del frontend no afecta al backend.
- (+) Queda mes clar on va cada cosa.
- (-) Si un canvi afecta les dues parts, s'han de fer commits als dos repos.
- (-) Algunes configuracions (ESLint, Prettier...) es repeteixen als dos repos.
