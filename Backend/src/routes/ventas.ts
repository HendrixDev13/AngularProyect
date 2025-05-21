import { Router } from 'express';
import { guardarVenta } from '../controllers/ventas';
import { getSiguienteNumeroRecibo } from '../controllers/ventas';
const router = Router();

router.post('/', guardarVenta);
router.get('/siguiente-recibo', getSiguienteNumeroRecibo);
export default router;
