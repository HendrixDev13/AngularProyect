import express from 'express';
import cors from 'cors';
import db from './database/config';
import ventasRoutes from './routes/ventas';


// Importar rutas
import movimientosRoutes from './routes/movimientos';
import userRoutes from './routes/user';
import productRoutes from './routes/product';
import reportesRoutes from './routes/reportes';
// Asociaciones (esto es clave para que funcione el login)
import './models/associations';

const app = express();
app.use(cors());
app.use(express.json());

// Montar rutas
app.use('/api/products', productRoutes); // si tienes productos
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/reportes', reportesRoutes);
// Conexión a BD
db.sync()
  .then(() => console.log('✅ Base de datos conectada'))
  .catch((err) => console.error('❌ Error al conectar base de datos:', err));

// Iniciar servidor
app.listen(3001, () => {
  console.log('🚀 Backend corriendo en http://localhost:3001');
});
