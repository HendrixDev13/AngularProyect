import express from 'express';
import cors from 'cors';
import path from 'path';
import productRoutes from './routes/product'; // ✅ tus rutas
import movimientosRoutes from './routes/movimientos';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import routesUsers from './routes/user';
import './models/associations'; // Importa las asociaciones
import reportesRoutes from './routes/reportes';

const serverDistFolder = path.resolve();
const browserDistFolder = path.resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// ✅ MIDDLEWARES GLOBALES
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json()); // MUY importante para POST/PUT en futuro

// ✅ TUS RUTAS API
app.use('/api/products', productRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/users', routesUsers);   
app.use('/api/reportes', reportesRoutes);

// ✅ ARCHIVOS ESTÁTICOS (angular build)
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// ✅ SSR DE ANGULAR (cualquier ruta que no sea /api)
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// ✅ INICIO DEL SERVIDOR
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// ✅ EXPORTADOR PARA BUILD SSR
export const reqHandler = createNodeRequestHandler(app);
