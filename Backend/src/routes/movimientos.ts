import { Router } from 'express';
import { getMovimientos } from '../controllers/movimientos';
import { descontarStock } from '../controllers/movimientos';
import { reponerStock } from '../controllers/movimientos';


const router = Router();

router.get('/', getMovimientos);
router.post('/descontar', descontarStock);
router.post('/reponer', reponerStock);




export default router;
