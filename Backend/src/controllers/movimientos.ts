import { Request, Response } from 'express';
import MovimientoInventario from '../models/movimientoInventario';
import Product from '../models/product';
import Inventario from '../models/inventario';

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


export const descontarStock = async (req: Request, res: Response) => {
  const { id_producto, cantidad } = req.body;

  try {
    await Inventario.decrement('StockActual', {
      by: cantidad,
      where: { id_producto }
    });

    res.status(200).json({ mensaje: 'Stock descontado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
  export const reponerStock = async (req: Request, res: Response) => {
  const { id_producto, cantidad } = req.body;

  try {
    await Inventario.increment('StockActual', {
      by: cantidad,
      where: { id_producto }
    });

    res.status(200).json({ mensaje: 'Stock repuesto correctamente' });
  } catch (error) {
    console.error('❌ Error al reponer stock:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};