import { Component } from '@angular/core';
import { ReporteService } from '../../../services/reporte.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reporte-inventario',
  standalone: false,
  templateUrl: './reporte-inventario.component.html',
  styleUrl: './reporte-inventario.component.css'
})
export class ReporteInventarioComponent {
  inventario: any[] = [];

  constructor(
    private reporteSrv: ReporteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reporteSrv.getInventario().subscribe({
      next: data => this.inventario = data,
      error: () => alert('Error al cargar inventario')
    });
  }

  exportarExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.inventario);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    XLSX.writeFile(wb, 'reporte-inventario.xlsx');
  }

  regresarAReportes(): void {
    this.router.navigate(['/reportes']);
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}



