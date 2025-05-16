import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../../services/reporte.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-reporte-ventas',
  standalone: false,
  templateUrl: './reporte-ventas.component.html',
  styleUrl: './reporte-ventas.component.css'
})
export class ReporteVentasComponent implements OnInit {
  ventas: any[] = [];
  ventasOriginales: any[] = [];
  filtro = {
    desde: '',
    hasta: ''
  };

  constructor(private reporteSrv: ReporteService, private router: Router) {}

  ngOnInit(): void {
    this.reporteSrv.getVentasTotales().subscribe({
      next: data => {
        this.ventasOriginales = data;
        this.ventas = [...data]; // copia de los datos para filtrar
      },
      error: () => alert('Error al cargar reporte de ventas')
    });
  }

  exportarExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ventas);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');

    XLSX.writeFile(wb, 'reporte-ventas.xlsx');
  }

filtrarVentas(): void {
  if (!this.filtro.desde || !this.filtro.hasta) {
    alert('Debe seleccionar un rango de fechas');
    return;
  }

  this.ventas = this.ventasOriginales.filter(v => {
    const fecha = new Date(v.FechaGeneracion);
    return (
      fecha >= new Date(this.filtro.desde) &&
      fecha <= new Date(this.filtro.hasta)
    );
  });
}

limpiarFiltro(): void {
  this.filtro.desde = '';
  this.filtro.hasta = '';
  this.ventas = [...this.ventasOriginales]; // restaurar todos los datos
}
  regresarAReportes(): void {
  this.router.navigate(['/reportes']);
}

cerrarSesion(): void {
  localStorage.clear();
  this.router.navigate(['/login']);
}

}
