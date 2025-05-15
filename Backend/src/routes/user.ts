import { Router } from 'express';
import * as userController from '../controllers/user';
import validateToken from './validate-token';

const router = Router();

// Rutas públicas (sin autenticación)
router.post('/login', userController.loginUser);
router.post('/register', userController.newUser);

// Rutas protegidas (requieren autenticación)
router.get('/usuarios', validateToken, userController.getUsuarios);
router.put('/usuarios/:id', validateToken, userController.updateUsuario);
router.patch('/usuarios/:id/inhabilitar', validateToken, userController.inhabilitarUsuario);
router.patch('/usuarios/:id/habilitar', validateToken, userController.habilitarUsuario);

// Rutas para validar estado
router.get('/validar-estado', validateToken, userController.validarEstado);
router.get('/verificar-estado', validateToken, userController.verificarEstadoUsuario);

export default router;