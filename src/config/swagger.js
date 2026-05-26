const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'API de logística de inventarios',
    version: '1.0.0',
    description: 'Documentación Swagger para la API MVP de inventarios con MongoDB Atlas',
  },
  servers: [
    { url: 'https://bdatlas.onrender.com', description: 'Deployment Render' },
    { url: 'http://localhost:4000', description: 'Local development' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'user'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UserCreate: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'user'] },
        },
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          sku: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          unitPrice: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ProductCreate: {
        type: 'object',
        required: ['sku', 'name', 'unitPrice'],
        properties: {
          sku: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          unitPrice: { type: 'number' },
        },
      },
      Inventory: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          productId: { type: 'string' },
          warehouse: { type: 'string' },
          quantity: { type: 'number' },
          minimumQuantity: { type: 'number' },
          location: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      InventoryCreate: {
        type: 'object',
        required: ['productId', 'warehouse', 'quantity', 'minimumQuantity'],
        properties: {
          productId: { type: 'string' },
          warehouse: { type: 'string' },
          quantity: { type: 'number' },
          minimumQuantity: { type: 'number' },
          location: { type: 'string' },
        },
      },
      Movement: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          productId: { type: 'string' },
          userId: { type: 'string' },
          type: { type: 'string', enum: ['inbound', 'outbound', 'adjustment'] },
          quantity: { type: 'number' },
          reason: { type: 'string' },
          warehouse: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      MovementCreate: {
        type: 'object',
        required: ['productId', 'userId', 'type', 'quantity', 'warehouse'],
        properties: {
          productId: { type: 'string' },
          userId: { type: 'string' },
          type: { type: 'string', enum: ['inbound', 'outbound', 'adjustment'] },
          quantity: { type: 'number' },
          reason: { type: 'string' },
          warehouse: { type: 'string' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Token de acceso y datos de usuario',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          '401': { description: 'Credenciales inválidas' },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar un usuario (solo admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserCreate' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuario creado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          '403': { description: 'No autorizado' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Obtener datos del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Usuario actual',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          '401': { description: 'Token inválido o ausente' },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Listar usuarios',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de usuarios',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Crear un usuario',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserCreate' },
            },
          },
        },
        responses: {
          '201': { description: 'Usuario creado' },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Obtener usuario por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Usuario', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          '404': { description: 'Usuario no encontrado' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Actualizar usuario',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserCreate' },
            },
          },
        },
        responses: { '200': { description: 'Usuario actualizado' } },
      },
      delete: {
        tags: ['Users'],
        summary: 'Eliminar usuario',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Usuario eliminado' } },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Listar productos',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'sku', in: 'query', schema: { type: 'string' } },
          { name: 'name', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de productos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Crear producto',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductCreate' } } },
        },
        responses: { '201': { description: 'Producto creado' } },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Obtener producto',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Producto', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } } },
      },
      put: {
        tags: ['Products'],
        summary: 'Actualizar producto',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductCreate' } } } },
        responses: { '200': { description: 'Producto actualizado' } },
      },
      delete: {
        tags: ['Products'],
        summary: 'Eliminar producto',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Producto eliminado' } },
      },
    },
    '/inventory': {
      get: {
        tags: ['Inventory'],
        summary: 'Listar inventario',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'query', schema: { type: 'string' } },
          { name: 'warehouse', in: 'query', schema: { type: 'string' } },
          { name: 'location', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Lista de inventario', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Inventory' } } } } } },
      },
      post: {
        tags: ['Inventory'],
        summary: 'Crear registro de inventario',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryCreate' } } } },
        responses: { '201': { description: 'Inventario creado' } },
      },
    },
    '/inventory/{id}': {
      get: {
        tags: ['Inventory'],
        summary: 'Obtener inventario',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Registro de inventario', content: { 'application/json': { schema: { $ref: '#/components/schemas/Inventory' } } } } },
      },
      put: {
        tags: ['Inventory'],
        summary: 'Actualizar inventario',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryCreate' } } } },
        responses: { '200': { description: 'Inventario actualizado' } },
      },
      delete: {
        tags: ['Inventory'],
        summary: 'Eliminar inventario',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Inventario eliminado' } },
      },
    },
    '/movements': {
      get: {
        tags: ['Movements'],
        summary: 'Listar movimientos',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'query', schema: { type: 'string' } },
          { name: 'warehouse', in: 'query', schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'userId', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Lista de movimientos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Movement' } } } } } },
      },
      post: {
        tags: ['Movements'],
        summary: 'Crear movimiento',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/MovementCreate' } } } },
        responses: { '201': { description: 'Movimiento creado' } },
      },
    },
    '/movements/{id}': {
      get: {
        tags: ['Movements'],
        summary: 'Obtener movimiento',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Movimiento', content: { 'application/json': { schema: { $ref: '#/components/schemas/Movement' } } } } },
      },
    },
  },
};

module.exports = swaggerSpec;
