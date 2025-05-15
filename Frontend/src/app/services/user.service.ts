import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private base = 'http://localhost:3001/api/users';  // Ruta base para todos los endpoints

  constructor(private http: HttpClient) {}

  /** Login */
  login(user: LoginUser): Observable<{ token: string; rol: string; nombre: string }> {
    return this.http.post<{ token: string; rol: string; nombre: string }>(
      `${this.base}/login`, user
    );
  }

  /** GET todos los usuarios */
getUsuarios(): Observable<any[]> {
  console.log('Llamando al endpoint:', `${this.base}/usuarios`);
  return this.http.get<any[]>(`${this.base}/usuarios`);
}

  /** PUT inhabilitar / habilitar usuario */
inhabilitarUsuario(id: number) {
  return this.http.patch(`${this.base}/usuarios/${id}/inhabilitar`, {});
}

habilitarUsuario(id: number) {
  return this.http.patch(`${this.base}/usuarios/${id}/habilitar`, {});
}

  /** POST nuevo usuario */
registrarUsuario(usuario: any): Observable<any> {
  return this.http.post(`${this.base}/register`, usuario); // ✅ AÑADE '/register'
}


  /** PUT actualizar usuario */
    actualizarUsuario(id: number, data: any): Observable<any> {
    // AHORA apunta al path correcto:
    return this.http.put(`${this.base}/usuarios/${id}`, data);
  }

validarEstadoUsuario(): Observable<any> {
  return this.http.get(`${this.base}/estado`);
}




}
