import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';

export const newUser = async (req: Request, res: Response) => {
  const { nombre, password, id_rol } = req.body;

  // Validar que se envíen los datos requeridos
  if (!nombre || !password || !id_rol) {
    return res.status(400).json({
      msg: 'Faltan datos obligatorios: nombre, password o id_rol',
    });
  }

  try {
    const user = await User.findOne({ where: { Nombre: nombre } });

    if (user) {
      return res.status(400).json({
        msg: `El usuario ${nombre} ya existe`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      Nombre: nombre,
      Password: hashedPassword,
      id_rol,
    });

    res.json({
      msg: `Usuario ${nombre} creado exitosamente`,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error interno al crear el usuario',
      error,
    });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({
      msg: 'Debes enviar nombre y password',
    });
  }

  try {
    const user: any = await User.findOne({
      where: { Nombre: nombre },
      include: [{ association: 'rol' }]
    });
    

    if (!user) {
      return res.status(404).json({
        msg: `El usuario ${nombre} no existe`,
      });
    }

    const passwordValid = await bcrypt.compare(password, user.Password);

    if (!passwordValid) {
      return res.status(401).json({
        msg: 'La contraseña es incorrecta',
      });
    }

    const token = jwt.sign(
      {
        id: user.id_usuario,
        nombre: user.Nombre,
        rol: user.id_rol,
      },
      process.env.SECRET_KEY || 'pepito123',
    );

    // ✅ Esto es lo único que necesitás para mostrar solo el token entre comillas
    res.json({
      token,
      rol: user.rol.NombreRol,
      nombre: user.Nombre
    });
    
    
    
  } catch (error: any) {
    console.error('❌ Error en login:', error?.message || error);
    res.status(500).json({
      msg: 'Error interno al iniciar sesión',
      error: error?.message || 'Error desconocido'
    });
  }
  
};
