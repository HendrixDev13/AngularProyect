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
    this.myApiUrl = '/api/products';    // URL del API de usuarios
   }

   getProducts(): Observable<Product[]> {
  /*  const token = localStorage.getItem('token');*/
  /*  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);*/
  /*  return this.http.get<Product[]>(`${this.myAppUrl}${this.myApiUrl}`,{ headers: headers });*/
  return this.http.get<Product[]>(`${this.myAppUrl}${this.myApiUrl}`);


   }


}
