import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verificarToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token no proporcionado o malformado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'pepito123') as any;
    req.uid = decoded.id; // 👈 así se agrega el ID al request
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
};
