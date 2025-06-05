import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private myAppUrl = environment.endpoint;

  constructor(private http: HttpClient) {}

  getSiguienteRecibo(): Observable<number> {
    return this.http.get<{ numero: number }>(`${this.myAppUrl}/api/ventas/siguiente-recibo`)
      .pipe(map(resp => resp.numero));
  }

  guardarVenta(ventaPayload: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  return this.http.post(`${this.myAppUrl}/api/ventas`, ventaPayload, { headers });
}

}
