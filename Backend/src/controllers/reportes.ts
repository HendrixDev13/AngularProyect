import { Request, Response } from 'express';
import sequelize from '../database/config'; // ajusta si tu conexión está en otro archivo

export const obtenerReporteVentasMensual = async (req: Request, res: Response) => {
  try {
    const [result] = await sequelize.query(`
  SELECT 
    YEAR(V.fecha) AS Anio,
    FORMAT(V.fecha, 'MMMM', 'es-ES') AS Mes,
    SUM(DV.subtotal) AS TotalVentas,
    CAST(SUM(DV.subtotal) * 100.0 /
      (SELECT SUM(DV2.subtotal)
       FROM tbl_DetalleVenta DV2
       JOIN tbl_Venta V2 ON V2.id_venta = DV2.id_venta
       WHERE YEAR(V2.fecha) = YEAR(V.fecha))
    AS DECIMAL(5,2)) AS PorcentajeVentas,
    CONVERT(VARCHAR, GETDATE(), 120) AS FechaGeneracion,
    MONTH(V.fecha) AS MesNumero
  FROM 
    tbl_DetalleVenta DV
  JOIN 
    tbl_Venta V ON V.id_venta = DV.id_venta
  GROUP BY 
    YEAR(V.fecha), FORMAT(V.fecha, 'MMMM', 'es-ES'), MONTH(V.fecha)
  ORDER BY 
    Anio, MesNumero;
`);


    res.json(result);
  } catch (error) {
    console.error('❌ Error al generar el reporte mensual:', error);
    res.status(500).json({ msg: 'Error al generar el reporte mensual' });
  }
};



