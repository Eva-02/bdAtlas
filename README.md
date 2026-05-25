# API de Logística de Inventarios

API MVP para gestión de inventarios y movimientos logísticos con MongoDB Atlas.

## Características

- Autenticación con JWT
- Roles `admin` y `user`
- CRUD completo para `admin`
- Solo lectura para `user`
- Gestión de productos, inventario y movimientos
- Seed inicial de administrador

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs

## Estructura del proyecto

- `server.js`: punto de entrada de la API
- `src/config/db.js`: conexión a MongoDB Atlas
- `src/models/`: modelos de datos
- `src/routes/`: rutas para autenticación, usuarios, productos, inventario y movimientos
- `src/middleware/auth.js`: verificación de token y roles
- `.env.example`: variables de entorno necesarias

## Instalación

```bash
npm install
```

## Configuración

Copia `.env.example` a `.env` y completa los valores:

```env
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/inventario?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_jwt
PORT=4000
ADMIN_EMAIL=admin@empresa.com
ADMIN_PASSWORD=admin123
```

## Ejecución

```bash
npm start
```

## Endpoints principales

- `POST /auth/login`: inicio de sesión
- `POST /auth/register`: registro de usuario (solo admin)
- `GET /me`: información del usuario autenticado
- `GET /products`, `GET /products/:id`: consulta de productos
- `POST /products`, `PUT /products/:id`, `DELETE /products/:id`: gestión de productos (solo admin)
- `GET /inventory`, `GET /inventory/:id`: consulta de inventario
- `POST /inventory`, `PUT /inventory/:id`, `DELETE /inventory/:id`: gestión de inventario (solo admin)
- `GET /movements`, `GET /movements/:id`: consulta de movimientos
- `POST /movements`: creación de movimientos de inventario (solo admin)

## Flujo de uso

1. Crear un `.env` con la configuración de MongoDB Atlas.
2. Iniciar el servidor con `npm start`.
3. Usar `POST /auth/login` para obtener el token.
4. Enviar `Authorization: Bearer <token>` en las rutas protegidas.

## Notas

- La API está diseñada como MVP y puede extenderse con auditoría, reportes, control avanzado de stock y gestión multi-almacén.
- El primer administrador se crea automáticamente si existen las variables `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

## Preparación para GitHub

Este proyecto está listo para ser versionado y publicado en GitHub. Si deseas subirlo a un repositorio público, inicializa Git y agrega un remote con tu cuenta.
