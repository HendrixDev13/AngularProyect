import { Request, Response } from 'express';
import Venta from '../models/venta';
import DetalleVenta from '../models/detalleVenta';
import db from '../database/config'; // Asegúrate que esté importado

// ✅ GUARDAR VENTA con Número de Recibo
export const guardarVenta = async (req: Request, res: Response) => {
  const { usuario, productos } = req.body;

  if (
    typeof usuario !== 'number' ||
    !Array.isArray(productos) ||
    productos.length === 0
  ) {
    return res.status(400).json({ msg: 'Venta inválida: no hay productos' });
  }

  const t = await db.transaction();

  try {
    // 🔢 Obtener el siguiente número de recibo desde la BD
    const [resultado]: any = await db.query(`
      SELECT ISNULL(MAX(NumeroRecibo), 0) + 1 AS SiguienteRecibo FROM tbl_Venta
    `, { transaction: t });

    const siguienteRecibo = resultado[0]?.SiguienteRecibo || 1;

    // 💾 Guardar venta con el número de recibo
    const nuevaVenta = await Venta.create({
      id_usuario: usuario,
      NumeroRecibo: siguienteRecibo
    }, { transaction: t });

    // 💾 Guardar detalle de venta y descontar stock
    for (const item of productos) {
      if (
        typeof item.id !== 'number' ||
        typeof item.cantidad !== 'number' ||
        typeof item.precio !== 'number' ||
        typeof item.subtotal !== 'number'
      ) {
        // 🚨 Si hay error, rollback
        await t.rollback();
        return res.status(400).json({ msg: 'Producto mal formado' });
      }

      // 1️⃣ Guardar detalle
      await DetalleVenta.create({
        id_venta: nuevaVenta.id_venta,
        id_producto: item.id,
        precio_unitario: item.precio,
        cantidad: item.cantidad,
        subtotal: item.subtotal
      }, { transaction: t });

      // 2️⃣ Descontar stock
      await db.query(`
      UPDATE tbl_Inventario
      SET StockActual = StockActual - ?
      WHERE id_producto = ?
    `, {
      replacements: [item.cantidad, item.id],
      transaction: t
    });

    }

    // ✅ Si todo OK → commit
    await t.commit();

    return res.status(201).json({ msg: 'Venta y stock actualizados correctamente' });

  } catch (error) {
    console.error('❌ Error al guardar venta:', error);

    // 🚨 Si falla → rollback
    await t.rollback();

    return res.status(500).json({ msg: 'Error interno al guardar venta' });
  }
};


// ✅ OBTENER SIGUIENTE NÚMERO DE RECIBO
export const getSiguienteNumeroRecibo = async (req: Request, res: Response) => {
  try {
    const [resultado]: any = await db.query(`
      SELECT ISNULL(MAX(NumeroRecibo), 0) + 1 AS SiguienteRecibo FROM tbl_Venta
    `);

    const siguiente = resultado[0]?.SiguienteRecibo || 1;

    return res.json({ numero: siguiente });
  } catch (error) {
    console.error('❌ Error al obtener número de recibo:', error);
    return res.status(500).json({ mensaje: 'Error del servidor al obtener número de recibo' });
  }
};
