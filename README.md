# E-commerce Full Stack - Backend

Proyecto de tienda online (merchandising de Valorant) del módulo Desenvolupament d'aplicacions amb Frameworks client/servidor (curs 2026-2027).
Este repositorio contiene el backend: una API REST con Express y MongoDB.

## Tecnologías

- Node.js / Express
- MongoDB + Mongoose
- bcrypt (hash de contraseñas)
- Docker
- Postman

## Autor

Xinkai Zheng

## Cómo ejecutar el proyecto

1. Clonar el repositorio: `git clone https://github.com/kinzhe1019/ecommerce-backend.git`
2. Tener MongoDB funcionando en `localhost:27017` (yo uso Docker con la imagen `mongo:8`; el `docker-compose.yml` no está en este repositorio)
3. Entrar en la carpeta de la API: `cd ecommerce-backend/api`
4. Instalar dependencias: `npm install`
5. Copiar `.env.example` a `.env` y poner tu usuario y contraseña de MongoDB
6. Arrancar en modo desarrollo: `npm run dev`
7. La API funciona en `http://localhost:3000`

## Endpoints

| Recurso    | Endpoints                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| Productos  | `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id`                                         |
| Categorías | `GET/POST /api/categories`, `GET/PUT/DELETE /api/categories/:id`                                     |
| Usuarios   | `GET/POST /api/users`, `GET/PUT /api/users/:id`, `DELETE /api/users/:id` (desactiva: `active=false`) |

Filtros en `GET /api/categories` y `GET /api/users`: `?active=true`, `?name=texto`, `?sort=name` (o `-name`, `createdAt`, `-createdAt`; en usuarios también `email` y `-email`),`?page=1&limit=10` (máximo 50).

## Probar con Postman

1. Abrir Postman → **Import** → elegir los dos archivos de `api/postman/`:
   - `ecommerce.postman_collection.json` (colección "Ecommerce API")
   - `ecommerce-local.postman_environment.json` (entorno "Ecommerce Local")
2. Arriba a la derecha, seleccionar el entorno **Ecommerce Local** (`baseUrl = http://localhost:3000`).
3. Con la API arrancada, ejecutar las peticiones de las carpetas Products, Categories y Users, o toda la colección con **Run collection**.

## Aviso

Los endpoints de usuarios todavía no tienen JWT ni roles: solo se usan en local y con datos inventados. No se tienen que desplegar públicamente.
