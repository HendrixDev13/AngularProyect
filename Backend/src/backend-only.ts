import express from 'express';
import cors from 'cors';
import reportesRoutes from './routes/reportes';
import productRoutes from './routes/product';
import movimientosRoutes from './routes/movimientos';
import userRoutes from './routes/user';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reportes', reportesRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend dev server corriendo en http://localhost:${PORT}`);
});
