import express from 'express';
import {
  getProducts,
  getProductByCodigoBarras,
  registrarProductoConInventario,
  deleteProduct,
  deleteProductWithPin,
   // ✅ IMPORTA ESTA
} from '../controllers/product';
import { actualizarProductoConMovimiento } from '../controllers/product';
import { actualizarEstadoProducto } from '../controllers/product'; 
const router = express.Router();

router.get('/', getProducts);
router.get('/codigo/:codigo', getProductByCodigoBarras);
router.post('/registrar', registrarProductoConInventario);
router.delete('/:id', deleteProduct);
router.put('/actualizar/:id', actualizarProductoConMovimiento);
router.post('/eliminar-con-pin/:id', deleteProductWithPin); // 👈 esta línea debe estar // ✅ POST y con :id
router.patch('/estado/:id', actualizarEstadoProducto);

export default router;
