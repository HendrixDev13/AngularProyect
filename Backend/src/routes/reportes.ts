import { Router } from 'express';
import db from '../database/config';
import { obtenerReporteVentasMensual, obtenerPrimerUltimoLogPorRango } from '../controllers/reportes';


const router = Router();

router.get('/ventas', obtenerReporteVentasMensual);


// NUEVO endpoint para primera y última generación del rango dado:
router.get('/ventas/logs/rango', obtenerPrimerUltimoLogPorRango);

// La ruta queda explícita como “/ventas/mensual”
router.get('/ganancias/detalle', async (req, res) => {
  const { desde, hasta, mes } = req.query as { desde?: string; hasta?: string; mes?: string };

  let whereClause = '';
  let replacements: any = {};

  if (desde && hasta) {
    whereClause = `WHERE CAST(V.fecha AS DATE) BETWEEN :desde AND :hasta`;
    replacements = { desde, hasta };
  } else if (mes) {
    whereClause = `WHERE MONTH(V.fecha) = :mesSeleccionado`;
    replacements = { mesSeleccionado: parseInt(mes, 10) };
  }

  try {
    const [result] = await db.query(`
      SELECT 
        P.ProductoNombre AS Producto,
        CONVERT(VARCHAR(10), V.fecha, 23) AS FechaGeneracion,   -- ← Devuelve "2025-05-20"
        SUM(DV.cantidad) AS CantidadVendida,
        SUM(DV.precio_unitario * DV.cantidad) AS IngresoTotal,
        SUM(P.PrecioCosto * DV.cantidad) AS CostoTotal,
        SUM((DV.precio_unitario - P.PrecioCosto) * DV.cantidad) AS Ganancia
      FROM 
        tbl_DetalleVenta DV
      JOIN 
        tbl_Producto P ON DV.id_producto = P.id_producto
      JOIN 
        tbl_Venta V ON V.id_venta = DV.id_venta
      ${whereClause}
      GROUP BY 
        P.ProductoNombre, CONVERT(VARCHAR(10), V.fecha, 23)
      ORDER BY 
        FechaGeneracion ASC, Ganancia DESC;
    `, { replacements });

    res.json(result);
  } catch (error) {
    console.error('Error al obtener detalle de ganancias:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener ganancias' });
  }
});






      router.get('/inventario', async (_req, res) => {
    try {
      const [result] = await db.query(`
        SELECT 
          P.ProductoNombre AS Producto,
          ISNULL(I.StockActual, 0) AS StockActual,
          P.PrecioVenta,
          ISNULL(P.PrecioCosto, 0) AS PrecioCosto,
          ISNULL(I.StockActual * P.PrecioCosto, 0) AS ValorTotal
        FROM 
          tbl_Producto P
        LEFT JOIN 
          tbl_Inventario I ON I.id_producto = P.id_producto
        ORDER BY 
          P.ProductoNombre;
      `);

      res.json(result);
    } catch (error) {
      console.error('Error al obtener reporte de inventario:', error);
      res.status(500).json({ mensaje: 'Error al obtener inventario' });
    }
  });




    router.get('/costo-ventas', async (_req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        FORMAT(V.fecha, 'MMMM yyyy', 'es-ES') AS Mes,
        SUM(DV.precio_unitario * DV.cantidad) AS TotalVentas,
        SUM(P.PrecioCosto * DV.cantidad) AS CostoTotal,
        SUM((DV.precio_unitario - P.PrecioCosto) * DV.cantidad) AS Ganancia
      FROM 
        tbl_DetalleVenta DV
      JOIN 
        tbl_Producto P ON DV.id_producto = P.id_producto
      JOIN 
        tbl_Venta V ON DV.id_venta = V.id_venta
      GROUP BY 
        FORMAT(V.fecha, 'MMMM yyyy', 'es-ES')
      ORDER BY 
        MIN(V.fecha) DESC
    `);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener reporte de costos:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener costo de ventas' });
  }
});
    
router.get('/grafico-ventas', async (_req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        FORMAT(V.fecha, 'MMMM yyyy', 'es-ES') AS Mes,
        SUM(DV.precio_unitario * DV.cantidad) AS TotalVentas
      FROM 
        tbl_DetalleVenta DV
      JOIN 
        tbl_Venta V ON DV.id_venta = V.id_venta
      GROUP BY 
        FORMAT(V.fecha, 'MMMM yyyy', 'es-ES')
      ORDER BY 
        MIN(V.fecha)
    `);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener gráfico de ventas:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener gráfico' });
  }
});


router.get('/grafico-ganancias', async (_req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        FORMAT(V.fecha, 'MMMM yyyy', 'es-ES') AS Mes,
        SUM((DV.precio_unitario - P.PrecioCosto) * DV.cantidad) AS Ganancia
      FROM 
        tbl_DetalleVenta DV
      JOIN 
        tbl_Producto P ON DV.id_producto = P.id_producto
      JOIN 
        tbl_Venta V ON DV.id_venta = V.id_venta
      GROUP BY 
        FORMAT(V.fecha, 'MMMM yyyy', 'es-ES')
      ORDER BY 
        MIN(V.fecha)
    `);

    res.json(result);
  } catch (error) {
    console.error('Error al obtener gráfico de ganancias:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener gráfico de ganancias' });
  }
});





export default router;
