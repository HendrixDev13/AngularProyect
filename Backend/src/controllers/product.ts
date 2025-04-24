import { Request, Response } from 'express';
import Product from '../models/product';
import Inventario from '../models/inventario';
import MovimientoInventario from '../models/movimientoInventario';
import db from '../database/config';


export const getProducts = async (req: Request, res: Response) => {
  try {
    const productos = await Product.findAll({
      include: [
        {
          model: Inventario,
          as: 'inventario',
          attributes: ['StockActual', 'PrecioVentaInicial', 'Descripcion']
        }
      ]
    });

    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export const getProductByCodigoBarras = async (req: Request, res: Response) => {
  const { codigo } = req.params;
  console.log('➡️ Llegó al endpoint con código:', codigo);

  try {
    const producto = await Product.findOne({
      where: { CodigoBarras: codigo }
    });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.json(producto);
  } catch (error) {
    console.error('Error al buscar producto:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export const registrarProductoConInventario = async (req: Request, res: Response) => {
  try {
    const { producto, inventario } = req.body;
    const nuevoProducto = await Product.create(producto);
    const id_producto = nuevoProducto.getDataValue('id_producto');

    const datosInventario = {
      ...inventario,
      id_producto,
      PrecioTotal: inventario.StockActual * inventario.PrecioVentaInicial,
    };

    await Inventario.create(datosInventario);

    res.status(201).json({ mensaje: 'Producto e inventario registrados correctamente', producto: nuevoProducto });
  } catch (error) {
    console.error('❌ Error al registrar producto con inventario:', error);
    res.status(500).json({ mensaje: 'Error al registrar producto e inventario' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Product.destroy({ where: { id_producto: id } });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
};

export const deleteProductWithPin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { pin } = req.body;

  if (!id || !pin) {
    return res.status(400).json({ msg: 'ID y PIN son requeridos' });
  }

  if (pin !== '1234') {
    return res.status(401).json({ msg: 'PIN incorrecto' });
  }

  try {
    // Paso 1: Buscar el producto
    const producto = await Product.findByPk(id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Paso 2: Eliminar primero el inventario relacionado
    await Inventario.destroy({ where: { id_producto: id } });

    // Paso 3: Luego eliminar el producto
    await producto.destroy();

    return res.json({ msg: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error interno al eliminar producto:', error);
    return res.status(500).json({ msg: 'Error interno al eliminar producto' });
  }
};

export const actualizarProductoConMovimiento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { producto, inventario, motivo } = req.body;

  try {
    const productoExistente = await Product.findByPk(id, {
      include: [{ model: Inventario, as: 'inventario' }]
    });

    if (!productoExistente) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Guardar stock anterior para registrar movimiento si cambia
    const inventarioExistente = productoExistente.getDataValue('inventario');
    const stockAnterior = inventarioExistente?.StockActual ?? 0;

    // Actualizar datos del producto
    await productoExistente.update(producto);

    if (inventarioExistente) {
      await inventarioExistente.update(inventario);

      // Verificar si hubo cambio de stock
      const diferenciaStock = inventario.StockActual - stockAnterior;

      // Registrar movimiento si hubo algún cambio
      if (
        diferenciaStock !== 0 || motivo.trim() !== ''
      ) {
        const tipo = diferenciaStock > 0 ? 'Entrada' : (diferenciaStock < 0 ? 'Salida' : 'Modificación');
        const cantidad = Math.abs(diferenciaStock);

        
        await MovimientoInventario.create({
          id_producto : id,
          TipoMovimiento : tipo,
          Cantidad       : cantidad,
          Origen         : 'Inventario',
          Referencia     : null,                 // o el número que corresponda
          Motivo         : motivo,
          FechaMovimiento: db.literal('GETDATE()')   // 👈 deja que SQL Server genere la fecha
        });
        
        
        
        
      }
    }

    return res.json({ msg: 'Producto actualizado correctamente' });

  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    return res.status(500).json({ msg: 'Error al actualizar el producto' });
  }
};
