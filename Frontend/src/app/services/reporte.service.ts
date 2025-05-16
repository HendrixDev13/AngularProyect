import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private baseUrl = 'http://localhost:3001/api/reportes';

  constructor(private http: HttpClient) {}

  getVentasTotales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ventas`);
  }

  getGananciasDetalle(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/ganancias/detalle`);
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


}
