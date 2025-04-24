import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private myAppUrl: string;
  private myApiUrl: string;


  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/products';   // URL del API de usuarios
   }

   getProducts(): Observable<Product[]> {
  /*  const token = localStorage.getItem('token');*/
  /*  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);*/
  /*  return this.http.get<Product[]>(`${this.myAppUrl}${this.myApiUrl}`,{ headers: headers });*/
  return this.http.get<Product[]>(`${this.myAppUrl}${this.myApiUrl}`);
   }

   getByCodigoBarras(codigo: string) {
    // ✅ Correcto
    return this.http.get<any>(`http://localhost:3001/api/products/${codigo}`);

  }

  registrarProducto(data: any) {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/registrar`, data);
  }

  actualizarProducto(id: number, data: any): Observable<any> {
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}/actualizar/${id}`, data);
  }

  registrarMovimientoInventario(data: any) {
    return this.http.post(`${this.myAppUrl}/api/movimientos/registrar`, data);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  eliminarProductoConPin(id: number, pin: string): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/eliminar-con-pin/${id}`, { pin });
  }

  getMovimientosPorProducto(id_producto: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.myAppUrl}/api/movimientos/producto/${id_producto}`);
  }





}
