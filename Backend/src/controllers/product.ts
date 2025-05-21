import { Request, Response } from 'express';
import Product from '../models/product';
import Inventario from '../models/inventario';
import MovimientoInventario from '../models/movimientoInventario';
import db from '../database/config';


export const getProducts = async (req: Request, res: Response) => {
  try {
    const productos = await Product.findAll({
    attributes: ['id_producto', 'ProductoNombre', 'CodigoBarras', 'PrecioVenta', 'PrecioCosto', 'Modelo', 'Marca', 'Color', 'Descripcion'], // ✅ incluye PrecioCosto
    include: [
      {
        model: Inventario,
        as: 'inventario',
        attributes: ['StockActual', 'Descripcion']
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

    // ✅ Validación obligatoria
    if (
      !producto ||
      !producto.ProductoNombre ||
      !producto.PrecioVenta ||
      !producto.PrecioCosto ||
      !producto.CodigoBarras ||
      !producto.Modelo ||
      !producto.Marca ||
      !producto.Color
    ) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios del producto.' });
    }

    if (
      !inventario ||
      inventario.StockActual <= 0 
    ) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios del inventario.' });
    }

    // ✅ Confirmar lo que llega (opcional para debug)
    console.log('📦 Producto recibido:', producto);
    console.log('📦 Inventario recibido:', inventario);

    // ✅ Guardar el producto incluyendo PrecioCosto
    const nuevoProducto = await Product.create({
    CodigoBarras: producto.CodigoBarras,
    ProductoNombre: producto.ProductoNombre,
    Modelo: producto.Modelo,
    Marca: producto.Marca,
    Descripcion: producto.Descripcion,
    Color: producto.Color,
    PrecioVenta: producto.PrecioVenta,
    PrecioCosto: producto.PrecioCosto
  });

    const id_producto = nuevoProducto.getDataValue('id_producto');

    // Calcular el total del inventario
    const datosInventario = {
      ...inventario,
      id_producto,
      PrecioTotal: inventario.StockActual * producto.PrecioCosto,
    };

    await Inventario.create(datosInventario);
  await MovimientoInventario.create({
    id_producto: id_producto,
    TipoMovimiento: 'Entrada',
    Cantidad: inventario.StockActual,
    Origen: 'Inventario',
    Referencia: null,
    Motivo: 'Registro inicial',
    PrecioUnitario: producto.PrecioCosto, // 👈 Aquí guardas el precio
    FechaMovimiento: db.literal('GETDATE()')
  });
     return res.status(201).json({
      mensaje: 'Producto e inventario registrados correctamente',
      producto: nuevoProducto
    });

  } catch (error) {
    console.error('❌ Error al registrar producto con inventario:', error);
    res.status(500).json({ mensaje: 'Error al registrar producto e inventario' });

    return res.status(500).json({
      mensaje: 'Error al registrar producto e inventario'
    });
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

export const deleteProductWithPin = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { pin } = req.body;

  if (pin !== '1234') {
    res.status(401).json({ message: 'PIN incorrecto' });
    return;    
  }

  try {
    // 1. Borrar movimientos relacionados
    await MovimientoInventario.destroy({ where: { id_producto: id } });

    // 2. Borrar inventario
    await Inventario.destroy({ where: { id_producto: id } });

    // 3. Borrar producto
    await Product.destroy({ where: { id_producto: id } });

    res.json({ message: 'Producto eliminado con éxito' });
    return;
  } catch (error) {
    console.error('Error interno al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno al eliminar producto' });
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
  const inventarioExistente = productoExistente.inventario;

  const stockAnterior = inventarioExistente?.StockActual ?? 0;

  if (inventarioExistente) {
    await inventarioExistente.update(inventario);
  }


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
          PrecioUnitario: producto.PrecioCosto, // ✅ nuevo campo
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
