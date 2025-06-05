import { Request, Response } from 'express';
import sequelize from '../database/config'; // ajusta si tu conexión está en otro archivo


export const obtenerReporteVentasMensual = async (req: Request, res: Response) => {
  const { desde, hasta } = req.query as { desde?: string; hasta?: string };

  try {
    let fechaGeneracion: string | null = null;

    // 1) SOLO graba un LOG si se están enviando parámetros “desde” y “hasta”
    if (desde && hasta) {
      const insertSql = `
        INSERT INTO tbl_ReporteVentaLog (desde, hasta)
        VALUES (:desdeParam, :hastaParam);
        SELECT SCOPE_IDENTITY() AS logId;
      `;
      const replacementsInsert = {
        desdeParam: desde,
        hastaParam: hasta
      };
      const [insertResult] = await sequelize.query(insertSql, { replacements: replacementsInsert });
      const logId = (insertResult as any[])[0].logId;

      const [tsResult] = await sequelize.query(
        `SELECT fecha_generacion FROM tbl_ReporteVentaLog WHERE id = :logId`,
        { replacements: { logId } }
      );
      fechaGeneracion = (tsResult as any[])[0].fecha_generacion;
    }

    // 2) Ejecutar el SELECT del reporte (igual que antes)
    let whereClause = '';
    let replacementsSelect: any = {};
    if (desde && hasta) {
      whereClause = `
        WHERE CAST(V.fecha AS DATE) BETWEEN :desde AND :hasta
      `;
      replacementsSelect = { desde, hasta };
    }

    const sqlReporte = `
      SELECT
        YEAR(V.fecha)           AS Anio,
        MONTH(V.fecha)          AS MesNumero,
        FORMAT(V.fecha, 'MMMM', 'es-ES') AS MesNombre,
        SUM(DV.subtotal)        AS TotalVentas,
        CAST(
          SUM(DV.subtotal) * 100.0 /
          (
            SELECT SUM(DV2.subtotal)
            FROM tbl_DetalleVenta DV2
            JOIN tbl_Venta V2 ON V2.id_venta = DV2.id_venta
            WHERE YEAR(V2.fecha) = YEAR(V.fecha)
          )
        AS DECIMAL(5,2))       AS PorcentajeVentas
      FROM tbl_DetalleVenta DV
      JOIN tbl_Venta V ON V.id_venta = DV.id_venta
      ${whereClause}
      GROUP BY
        YEAR(V.fecha),
        MONTH(V.fecha),
        FORMAT(V.fecha, 'MMMM', 'es-ES')
      ORDER BY
        Anio,
        MesNumero;
    `;
    const [resultRows] = await sequelize.query(sqlReporte, { replacements: replacementsSelect });

    // 3) Devolver JSON. Si no hubo filtro, fechaGeneracion queda null
    return res.json({
      fechaGeneracion,         // será string si hubo filtro; o null si fue GET sin filtro
      data: resultRows
    });
  } catch (error) {
    console.error('❌ Error al generar el reporte mensual:', error);
    return res.status(500).json({ msg: 'Error al generar el reporte mensual' });
  }
};

export const obtenerPrimerUltimoLogPorRango = async (req: Request, res: Response) => {
  // Leemos mismos parámetros “desde” y “hasta” que usa el filtro
  const { desde, hasta } = req.query as { desde?: string; hasta?: string };

  if (!desde || !hasta) {
    // Si no hay rango, devolvemos 400 Bad Request
    return res.status(400).json({ msg: 'Debe enviar parámetros "desde" y "hasta"' });
  }

  try {
    // Hacemos un SELECT para MIN y MAX de fecha_generacion
    const sql = `
      SELECT
        MIN(fecha_generacion) AS primeraFecha,
        MAX(fecha_generacion) AS ultimaFecha
      FROM tbl_ReporteVentaLog
      WHERE
        desde = :desdeParam
        AND hasta = :hastaParam
    `;
    const replacements = { desdeParam: desde, hastaParam: hasta };
    const [rows] = await sequelize.query(sql, { replacements });

    // rows[0] tendrá { primeraFecha: '2025-06-03 08:15:00', ultimaFecha: '2025-06-04 10:20:00' }
    const result = (rows as any[])[0];

    // Si no encontró ningún log, devolvemos ambos en null
    if (!result || (result.primeraFecha === null && result.ultimaFecha === null)) {
      return res.json({ primeraFecha: null, ultimaFecha: null });
    }

    return res.json({
      primeraFecha: result.primeraFecha,
      ultimaFecha: result.ultimaFecha
    });
  } catch (error) {
    console.error('❌ Error al obtener primer/último log por rango:', error);
    return res.status(500).json({ msg: 'Error al obtener fechas de generación' });
  }
};






/** 
/**
 * Devuelve el historial completo de las ejecuciones de reporte,
 * sacado de la tabla tbl_ReporteVentaLog.
 */
/*
export const obtenerHistorialReporteLog = async (_req: Request, res: Response) => {
  try {
    // Seleccionamos id, desde, hasta y fecha_generacion de todos los logs,
    // ordenados de más antiguo a más reciente (o puedes invertir con DESC).
    const sql = `
      SELECT 
        id,
        desde,
        hasta,
        fecha_generacion
      FROM tbl_ReporteVentaLog
      ORDER BY fecha_generacion ASC;  -- ASC = primero el más antiguo
    `;
    const [rows] = await sequelize.query(sql);
    return res.json(rows);  // será un array de objetos { id, desde, hasta, fecha_generacion }
  } catch (error) {
    console.error('❌ Error al obtener historial de reportes:', error);
    return res.status(500).json({ msg: 'Error al obtener historial de reportes' });
  }
};
*/