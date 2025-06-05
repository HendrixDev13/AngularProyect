import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private baseUrl = 'http://localhost:3001/api/reportes';

  constructor(private http: HttpClient) {}


   // 1) Método para cargar todo el histórico (sin filtro)
  getVentasTotales(): Observable<any[]> {
    const url = `${this.baseUrl}/ventas`;
    return this.http.get<any[]>(url);
  }

  // 2) Formatea "yyyy-MM-dd" sin desfase de zona horaria
  private formatFechaParaBackend(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(x => parseInt(x, 10));
    const localDate = new Date(year, month - 1, day);
    return localDate.toISOString().split('T')[0];
  }

  /**
   * 3) Ahora retorna Observable<{ fechaGeneracion: string; data: any[] }>
   *    para coincidir con lo que devuelve el controlador (fechaGeneracion + data).
   */
  getVentasTotalesPorFechas(
    desde: string,
    hasta: string
  ): Observable<{ fechaGeneracion: string; data: any[] }> {
    const desdeForm = this.formatFechaParaBackend(desde);
    const hastaForm = this.formatFechaParaBackend(hasta);

    const url = `${this.baseUrl}/ventas/mensual?desde=${desdeForm}&hasta=${hastaForm}`;
    console.log('[SERVICIO] URL llamada →', url);
    return this.http.get<{ fechaGeneracion: string; data: any[] }>(url);
  }

  getGananciasDetallePorFechas(desde: string, hasta: string): Observable<any[]> {
    // No usar Date, solo enviar el string que el input ya nos da en 'YYYY-MM-DD'
    const url = `${this.baseUrl}/ganancias/detalle?desde=${desde}&hasta=${hasta}`;
    return this.http.get<any[]>(url);
}



  // Resto de métodos sin cambios
  getGananciasDetalle(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ganancias/detalle`);
  }

  getGananciasDetallePorMes(mes: string): Observable<any[]> {
    const url = `${this.baseUrl}/ganancias/detalle?mes=${mes}`;
    return this.http.get<any[]>(url);
}


  getInventario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventario`);
  }

  getCostoVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/costo-ventas`);
  }

  getGraficoVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/grafico-ventas`);
  }

  getGraficoGanancias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/grafico-ganancias`);
  }

  /**
   * Get historial de ejecuciones de reporte: devuelve { id, desde, hasta, fecha_generacion }[]
   * Llamará a GET /api/reportes/ventas/logs
   */
  /*
  getHistorialReporteLogs(): Observable<{ id: number; desde: string | null; hasta: string | null; fecha_generacion: string }[]> {
    const url = `${this.baseUrl}/ventas/logs`;
    return this.http.get<{ id: number; desde: string | null; hasta: string | null; fecha_generacion: string }[]>(url);
  }
  */

   /**
   * Obtiene la primera y última fecha de generación para un rango dado.
   * GET /api/reportes/ventas/logs/rango?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
   */
  getPrimerUltimoLogPorRango(desde: string, hasta: string): Observable<{ primeraFecha: string | null; ultimaFecha: string | null }> {
    const url = `${this.baseUrl}/ventas/logs/rango?desde=${desde}&hasta=${hasta}`;
    return this.http.get<{ primeraFecha: string | null; ultimaFecha: string | null }>(url);
  }

}
