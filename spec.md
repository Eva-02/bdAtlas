# Especificación de API - Logística de Inventarios (MVP)

## 1. Propósito

Esta API ofrece un backend para gestión de inventarios y logística, usando MongoDB Atlas como base de datos. Está diseñada como MVP para cubrir los casos mínimos necesarios:

- Autenticación con usuarios de tipo `admin` y `normal`
- Operaciones CRUD de inventario y productos
- Control de permisos: `admin` puede crear, modificar y eliminar; `normal` puede únicamente consultar
- Manejo de movimientos de inventario
- Persistencia en MongoDB Atlas

## 2. Tecnologías y arquitectura

- Node.js + Express
- MongoDB Atlas
- JWT para autenticación
- Roles: `admin`, `user`
- JSON para todas las solicitudes y respuestas

## 3. Modelos de datos

### 3.1 Usuarios (`users`)

- `_id`: ObjectId
- `name`: string
- `email`: string
- `password`: string (hash)
- `role`: string (`admin` o `user`)
- `createdAt`: date
- `updatedAt`: date

### 3.2 Productos (`products`)

- `_id`: ObjectId
- `sku`: string (clave única)
- `name`: string
- `description`: string
- `category`: string
- `unitPrice`: number
- `createdAt`: date
- `updatedAt`: date

### 3.3 Inventario (`inventory`)

- `_id`: ObjectId
- `productId`: ObjectId referencia a `products`
- `warehouse`: string
- `quantity`: number
- `minimumQuantity`: number
- `location`: string (opcional)
- `updatedAt`: date

### 3.4 Movimientos de inventario (`movements`)

- `_id`: ObjectId
- `productId`: ObjectId referencia a `products`
- `userId`: ObjectId referencia a `users`
- `type`: string (`inbound`, `outbound`, `adjustment`)
- `quantity`: number
- `reason`: string
- `warehouse`: string
- `createdAt`: date

## 4. Seguridad y autenticación

### 4.1 JWT

- El login devuelve un token JWT
- Todas las rutas protegidas requieren `Authorization: Bearer <token>` en el encabezado
- El token debe incluir:
  - `sub`: id del usuario
  - `role`: `admin` o `user`

### 4.2 Controles de acceso

- `admin`
  - CRUD completo en usuarios, productos, inventario y movimientos
- `user`
  - Solo lectura en productos, inventario y movimientos
  - No puede crear, actualizar ni eliminar

## 5. Conexión a MongoDB Atlas

Variables de entorno:

- `MONGODB_URI`: cadena de conexión a MongoDB Atlas
- `JWT_SECRET`: clave secreta para firmar tokens JWT
- `PORT`: puerto del servidor

Ejemplo de `MONGODB_URI`:

```
mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/inventario?retryWrites=true&w=majority
```

## 6. Endpoints

### 6.1 Autenticación

#### POST /auth/login

- Descripción: Inicia sesión con email y contraseña.
- Acceso: público
- Request body:
  - `email`: string
  - `password`: string
- Response 200:
  - `token`: string
  - `user`: { `_id`, `name`, `email`, `role` }
- Errores:
  - 400: datos faltantes
  - 401: credenciales inválidas

#### POST /auth/register

- Descripción: Registra un nuevo usuario. En MVP, solo `admin` puede crear usuarios, o bien existe un primer usuario admin inicial.
- Acceso: `admin` o configuración inicial
- Request body:
  - `name`: string
  - `email`: string
  - `password`: string
  - `role`: string (`admin` | `user`)
- Response 201:
  - `user`: { `_id`, `name`, `email`, `role` }
- Errores:
  - 400: datos inválidos
  - 403: no autorizado

### 6.2 Usuarios

> Solo admin puede acceder a estas rutas.

#### GET /users

- Descripción: Lista todos los usuarios.
- Acceso: `admin`
- Response 200: array de usuarios

#### GET /users/:id

- Descripción: Obtiene datos de un usuario.
- Acceso: `admin`
- Response 200: usuario
- Errores: 404 si no existe

#### POST /users

- Descripción: Crea un usuario.
- Acceso: `admin`
- Request body: `name`, `email`, `password`, `role`
- Response 201: usuario creado

#### PUT /users/:id

- Descripción: Actualiza un usuario.
- Acceso: `admin`
- Request body: campos a actualizar (`name`, `email`, `role`, `password`)
- Response 200: usuario actualizado

#### DELETE /users/:id

- Descripción: Elimina un usuario.
- Acceso: `admin`
- Response 204

### 6.3 Productos

#### GET /products

- Descripción: Lista productos.
- Acceso: `admin`, `user`
- Query opcional:
  - `category`
  - `sku`
  - `name`
- Response 200: array de productos

#### GET /products/:id

- Descripción: Obtiene un producto.
- Acceso: `admin`, `user`
- Response 200: producto
- Errores: 404 si no existe

#### POST /products

- Descripción: Crea un producto.
- Acceso: `admin`
- Request body: `sku`, `name`, `description`, `category`, `unitPrice`
- Response 201: producto creado

#### PUT /products/:id

- Descripción: Actualiza un producto.
- Acceso: `admin`
- Request body: campos a actualizar
- Response 200: producto actualizado

#### DELETE /products/:id

- Descripción: Elimina un producto.
- Acceso: `admin`
- Response 204

### 6.4 Inventario

#### GET /inventory

- Descripción: Lista registros de inventario.
- Acceso: `admin`, `user`
- Query opcional:
  - `productId`
  - `warehouse`
  - `location`
- Response 200: array de inventario

#### GET /inventory/:id

- Descripción: Obtiene un registro de inventario.
- Acceso: `admin`, `user`
- Response 200: inventario
- Errores: 404

#### POST /inventory

- Descripción: Crea o inicializa un registro de inventario de un producto en un almacén.
- Acceso: `admin`
- Request body: `productId`, `warehouse`, `quantity`, `minimumQuantity`, `location`
- Response 201: inventario creado

#### PUT /inventory/:id

- Descripción: Actualiza un registro de inventario.
- Acceso: `admin`
- Request body: campos a actualizar (`quantity`, `minimumQuantity`, `location`)
- Response 200: inventario actualizado

#### DELETE /inventory/:id

- Descripción: Elimina un registro de inventario.
- Acceso: `admin`
- Response 204

### 6.5 Movimientos de inventario

#### GET /movements

- Descripción: Lista movimientos de inventario.
- Acceso: `admin`, `user`
- Query opcional:
  - `productId`
  - `warehouse`
  - `type`
  - `userId`
- Response 200: array de movimientos

#### GET /movements/:id

- Descripción: Obtiene un movimiento específico.
- Acceso: `admin`, `user`
- Response 200: movimiento
- Errores: 404

#### POST /movements

- Descripción: Registra un movimiento de inventario.
- Acceso: `admin`
- Request body: `productId`, `userId`, `type`, `quantity`, `reason`, `warehouse`
- Response 201: movimiento creado

### 6.6 Rutas auxiliares

#### GET /me

- Descripción: Devuelve información del usuario autenticado.
- Acceso: `admin`, `user`
- Response 200: usuario actual

## 7. Ejemplos de flujo MVP

### 7.1 Flujo de inicio de sesión

1. `POST /auth/login` con email y contraseña.
2. Recibir `token` JWT.
3. Usar `Authorization: Bearer <token>` en todas las rutas protegidas.

### 7.2 Flujo de administración

1. `admin` crea productos mediante `POST /products`.
2. `admin` inicializa inventario con `POST /inventory`.
3. `admin` crea movimientos con `POST /movements`.
4. `admin` revisa usuarios con `GET /users`.

### 7.3 Flujo del usuario normal

1. `user` inicia sesión.
2. `user` consulta `GET /products`.
3. `user` consulta `GET /inventory`.
4. `user` consulta `GET /movements`.

## 8. Validaciones y errores comunes

- 400 Bad Request: cuerpo inválido o datos obligatorios ausentes
- 401 Unauthorized: token JWT faltante o inválido
- 403 Forbidden: permiso insuficiente para acceso o acción
- 404 Not Found: recurso no encontrado
- 500 Internal Server Error: errores de servidor

## 9. Reglas adicionales

- `email` debe ser único en la colección `users`
- `sku` debe ser único en la colección `products`
- `quantity` en inventario debe ser >= 0
- `type` en movimientos solo `inbound`, `outbound`, `adjustment`

## 10. Consideraciones de MVP

- La API ofrece operaciones mínimas para inventario y logística.
- En futuras iteraciones se puede agregar: auditoría de cambios, validaciones más avanzadas, reportes de stock, múltiples almacenes, y dashboards.
- El enfoque actual es seguridad básica con JWT y roles.
