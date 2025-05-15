import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(this.router.createUrlTree(['/login']));
    }

    return this.userService.validarEstadoUsuario().pipe(
      map((res: any) => {
        if (res.estado === 'Activo') {
          return true;
        } else {
          localStorage.clear();
          return this.router.createUrlTree(['/login']);
        }
      }),
      catchError((err) => {
        console.error('[AuthGuard] Error validando estado', err);
        localStorage.clear();
        return of(this.router.createUrlTree(['/login']));
      })
    );
  }
}
