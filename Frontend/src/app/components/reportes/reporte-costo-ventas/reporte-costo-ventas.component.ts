import { Component } from '@angular/core';
import { ReporteService } from '../../../services/reporte.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reporte-costo-ventas',
  standalone: false,
  templateUrl: './reporte-costo-ventas.component.html',
  styleUrl: './reporte-costo-ventas.component.css'
})
export class ReporteCostoVentasComponent {
  datos: any[] = [];
  datosOriginales: any[] = [];
  filtro = {
    desde: '',
    hasta: ''
  };

  constructor(
    private reporteSrv: ReporteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reporteSrv.getCostoVentas().subscribe({
      next: data => {
        this.datosOriginales = data;
        this.datos = [...data];
      },
      error: () => alert('Error al cargar el reporte')
    });
  }

  exportarExcel(): void {
    const ws = XLSX.utils.json_to_sheet(this.datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CostoVentas');
    XLSX.writeFile(wb, 'reporte-costo-ventas.xlsx');
  }

  regresarAReportes(): void {
    this.router.navigate(['/reportes']);
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }



  filtrarCostos(): void {
    if (!this.filtro.desde || !this.filtro.hasta) {
      alert('Debe seleccionar un rango de fechas');
      return;
    }

    const desde = new Date(this.filtro.desde);
    const hasta = new Date(this.filtro.hasta);

    this.datos = this.datosOriginales.filter(item => {
      const fechaItem = new Date(item.Mes + ' 1'); // ej: "Mayo 2025 1"
      return fechaItem >= desde && fechaItem <= hasta;
    });
  }

  limpiarFiltro(): void {
    this.filtro.desde = '';
    this.filtro.hasta = '';
    this.datos = [...this.datosOriginales];
  }

}
