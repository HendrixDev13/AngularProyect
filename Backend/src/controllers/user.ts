import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import Rol from '../models/rol';
import { Op } from 'sequelize';

// ✅ IMPORTANTE: Asegúrate de que TODAS las funciones tengan 'export' al inicio
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

    if (user.estado === 'Inactivo') {
      return res.status(403).json({
        msg: 'Tu cuenta está inactiva. Contacta con el administrador.'
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

    res.json({
      token,
      rol: user.rol.NombreRol,
      nombre: user.Nombre
    });
    
  } catch (err: any) {
  console.error('❌ Error en login:', err?.parent ?? err);
  return res.status(500).json({ msg: 'Error interno', error: err });
}

};

export const getUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await User.findAll({
      include: [{ model: Rol, as: 'rol' }],
      order: [['id_usuario', 'ASC']]
      
    });
    res.json(usuarios);
  } catch (err) {
    console.error('Error en getUsuarios:', err);
    res.status(500).json({ msg: 'Error al obtener usuarios', err });
  }
};

export const updateUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { Nombre, id_rol, Password } = req.body;

  try {
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const datosActualizados: any = {
      Nombre,
      id_rol
    };

    if (Password) {
      const hashed = await bcrypt.hash(Password, 10);
      datosActualizados.Password = hashed;
    }

    await usuario.update(datosActualizados);
    res.json({ msg: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(400).json({ msg: 'Error al actualizar usuario', error });
  }
};

export const inhabilitarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    await usuario.update({ estado: 'Inactivo' });
    res.json({ msg: 'Usuario inhabilitado exitosamente' });
  } catch (error) {
    res.status(400).json({ msg: 'Error al inhabilitar usuario', error });
  }
};

export const habilitarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    await usuario.update({ estado: 'Activo' });
    res.json({ msg: 'Usuario habilitado exitosamente' });
  } catch (error) {
    res.status(400).json({ msg: 'Error al habilitar usuario', error });
  }
};

export const validarEstado = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).usuario?.id;

    const usuario = await User.findByPk(userId) as any;

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    return res.json({ estado: usuario.estado });
  } catch (error) {
    return res.status(500).json({ msg: 'Error al verificar estado', error });
  }
};

export const verificarEstadoUsuario = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).uid;

    const usuario = await User.findByPk(userId);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    if (usuario.estado !== 'Activo') {
      return res.status(403).json({ msg: 'Tu cuenta está inactiva.' });
    }

    res.json({ estado: usuario.estado });
  } catch (error) {
    console.error('[verificarEstadoUsuario] Error:', error);
    return res.status(500).json({ msg: 'Error al verificar estado del usuario' });
  }
};