import { Router } from 'express';
import { get } from 'http';
import { getProducts } from '../controllers/product';
import validateToken from './validate-token';

const router = Router();


router.get('/', validateToken ,getProducts);

export default router;
