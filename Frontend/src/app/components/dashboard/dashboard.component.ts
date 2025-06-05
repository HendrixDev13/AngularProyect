import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  rolUsuario: string = '';
  nombreUsuario: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.nombreUsuario = usuario.nombre;
    this.rolUsuario = usuario.rol;
  }

  goTo(ruta: string): void {
    this.router.navigate([`/${ruta}`]);
  }

  logout(): void {
    localStorage.clear();
    location.href = '/login';
  }
}
