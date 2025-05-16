import { Router } from 'express';
import db from '../database/config';


const router = Router();

    router.get('/ventas', async (_req, res) => {
    try {
        const [result] = await db.query(`
        SELECT 
            Mes, 
            TotalVentas, 
            PorcentajeVentas, 
            CONVERT(varchar, FechaGeneracion, 23) as FechaGeneracion
        FROM tbl_ReporteMensual
        ORDER BY FechaGeneracion DESC
        `);
        res.json(result);
    } catch (error) {
        console.error('Error al obtener reporte de ventas:', error);
        res.status(500).json({ mensaje: 'Error interno al obtener ventas' });
    }
    });

    router.get('/ganancias/detalle', async (_req, res) => {
    try {
        const [result] = await db.query(`
        SELECT 
            P.Nombre AS Producto,
            SUM(DV.cantidad) AS CantidadVendida,
            SUM(DV.precio_unitario * DV.cantidad) AS IngresoTotal,
            SUM(P.PrecioCosto * DV.cantidad) AS CostoTotal,
            SUM((DV.precio_unitario - P.PrecioCosto) * DV.cantidad) AS Ganancia
        FROM 
            tbl_DetalleVenta DV
        JOIN 
            tbl_Producto P ON DV.id_producto = P.id_producto
        GROUP BY 
            P.Nombre
        ORDER BY 
            Ganancia DESC
        `);
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
            P.Nombre AS Producto,
            I.Stock,
            P.PrecioVenta,
            P.PrecioCosto,
            (I.Stock * P.PrecioCosto) AS ValorTotal
        FROM 
            tbl_Inventario I
        JOIN 
            tbl_Producto P ON I.id_producto = P.id_producto
        ORDER BY 
            P.Nombre;
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
        FORMAT(V.fecha, 'MMMM yyyy') AS Mes,
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
        FORMAT(V.fecha, 'MMMM yyyy')
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
        FORMAT(V.fecha, 'MMMM yyyy') AS Mes,
        SUM(DV.precio_unitario * DV.cantidad) AS TotalVentas
      FROM 
        tbl_DetalleVenta DV
      JOIN 
        tbl_Venta V ON DV.id_venta = V.id_venta
      GROUP BY 
        FORMAT(V.fecha, 'MMMM yyyy')
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
  console.log('📊 Se alcanzó el endpoint /grafico-ganancias');
  res.json([{ Mes: 'Enero', Ganancia: 1000 }]); // respuesta temporal
});




export default router;
