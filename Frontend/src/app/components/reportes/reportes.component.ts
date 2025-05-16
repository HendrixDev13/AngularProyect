import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  standalone: false,
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  cargandoDashboard: boolean = false;
  constructor(private router: Router) {}


  irAlDashboard() {
    this.cargandoDashboard = true;
    setTimeout(() => this.router.navigate(['/dashboard']), 1000);
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  verReporte(tipo: string) {
    switch (tipo) {
      case 'ventas':
        this.router.navigate(['/reportes/ventas']);
        break;
      case 'ganancias':
        this.router.navigate(['/reportes/ganancias']);
        break;
      case 'inventario':
        this.router.navigate(['/reportes/inventario']);
        break;
      case 'costoventas':
        this.router.navigate(['/reportes/costo-ventas']);
        break;
      case 'graficoVentas':
        this.router.navigate(['/reportes/grafico-ventas']);
        break;
      case 'graficoGanancias':
        this.router.navigate(['/reportes/grafico-ganancias']);
        break;
    }
  }


}
