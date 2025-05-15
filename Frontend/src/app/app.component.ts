import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Frontend';

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('[AppComponent] Iniciando verificación de sesión');

    const token = localStorage.getItem('token');

    if (token) {
      console.log('[AppComponent] Token encontrado, validando estado...');
      this.userService.validarEstadoUsuario().subscribe({
        next: (res) => {
          console.log('[AppComponent] Estado recibido:', res.estado);
          if (res.estado !== 'Activo') {
            this.toastr.error('Tu cuenta está inactiva');
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error('[AppComponent] Error al validar estado:', err);
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
    } else {
      console.log('[AppComponent] No hay token, no se valida estado');
    }
  }
}
