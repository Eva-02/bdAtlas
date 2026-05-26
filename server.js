const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const productRoutes = require('./src/routes/products');
const inventoryRoutes = require('./src/routes/inventory');
const movementRoutes = require('./src/routes/movements');
const { verifyToken } = require('./src/middleware/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

connectDB();

const seedAdmin = require('./src/utils/seedAdmin');
seedAdmin().catch((error) => {
  console.error('Error al crear admin inicial:', error.message);
});

app.get('/', (req, res) => {
  res.json({ message: 'API de logística de inventarios en ejecución' });
});

console.log('Mounting routes: /auth, /users, /products, /inventory, /movements');
app.use('/auth', authRoutes);
app.use('/users', verifyToken, userRoutes);
app.use('/products', verifyToken, productRoutes);
app.use('/inventory', verifyToken, inventoryRoutes);
app.use('/movements', verifyToken, movementRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
