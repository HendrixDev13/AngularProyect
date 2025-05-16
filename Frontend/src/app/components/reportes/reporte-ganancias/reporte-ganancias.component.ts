import { Component } from '@angular/core';
import { ReporteService } from '../../../services/reporte.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reporte-ganancias',
  standalone: false,
  templateUrl: './reporte-ganancias.component.html',
  styleUrl: './reporte-ganancias.component.css'
})
export class ReporteGananciasComponent {
  ganancias: any[] = [];
  gananciasOriginales: any[] = [];
  filtro = {
    desde: '',
    hasta: ''
  };



  constructor(private reporteSrv: ReporteService, private router: Router) {}

ngOnInit(): void {
  this.reporteSrv.getGananciasDetalle().subscribe({
    next: data => {
      this.gananciasOriginales = data;
      this.ganancias = [...data];
    },
    error: () => alert('Error al cargar ganancias')
  });
}

  exportarExcel(): void {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ganancias);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ganancias');
  XLSX.writeFile(wb, 'reporte-ganancias.xlsx');
}

  filtrarGanancias(): void {
  if (!this.filtro.desde || !this.filtro.hasta) {
    alert('Debe seleccionar un rango de fechas');
    return;
  }

  this.ganancias = this.gananciasOriginales.filter(g => {
    // si tu backend devuelve fecha, se compara aquí
    const fecha = new Date(g.FechaGeneracion);
    return fecha >= new Date(this.filtro.desde) && fecha <= new Date(this.filtro.hasta);
  });
}

limpiarFiltro(): void {
  this.filtro.desde = '';
  this.filtro.hasta = '';
  this.ganancias = [...this.gananciasOriginales];
}

regresarAReportes(): void {
  this.router.navigate(['/reportes']);
}

cerrarSesion(): void {
  localStorage.clear();
  this.router.navigate(['/login']);
}

}
