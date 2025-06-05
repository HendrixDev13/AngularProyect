import { Router } from 'express';
import { guardarVenta } from '../controllers/ventas';
import { getSiguienteNumeroRecibo } from '../controllers/ventas';
import { verificarToken } from '../middleware/validar-jwt';




const router = Router();

router.post('/', verificarToken, guardarVenta);
router.get('/siguiente-recibo', getSiguienteNumeroRecibo);
export default router;
