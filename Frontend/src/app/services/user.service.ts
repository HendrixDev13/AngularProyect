import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginUser } from '../interfaces/user';





@Injectable({
  providedIn: 'root'
})
export class UserService{
  private myAppUrl: string;
  private myApiUrl: string;


  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/api/users';    // URL del API de usuarios
   }

   login(user: LoginUser): Observable<{ token: string; rol: string; nombre: string }> {
    return this.http.post<{ token: string; rol: string; nombre: string }>(
      `${this.myAppUrl}${this.myApiUrl}/login`, user
    );
  }


}
