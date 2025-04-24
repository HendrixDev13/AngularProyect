import { Request, Response } from 'express';
import MovimientoInventario from '../models/movimientoInventario';
import Product from '../models/product';

export const getMovimientos = async (req: Request, res: Response) => {
  try {
    const movimientos = await MovimientoInventario.findAll({
      include: [
        {
          model: Product,
          as: 'producto',
          attributes: ['ProductoNombre', 'Marca']
        }
      ],
      order: [['FechaMovimiento', 'DESC']]
    });

    res.json(movimientos);
  } catch (error) {
    console.error('❌ Error al obtener movimientos:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

