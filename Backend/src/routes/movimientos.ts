import { Router } from 'express';
import { getMovimientos } from '../controllers/movimientos';

const router = Router();

router.get('/', getMovimientos);

export default router;
