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
    this.rolUsuario = localStorage.getItem('rol') || '';
    this.nombreUsuario = localStorage.getItem('nombre') || '';
  }

  goTo(ruta: string): void {
    this.router.navigate([`/${ruta}`]);
  }

  logout(): void {
    localStorage.clear();
    location.href = '/login';
  }
}
