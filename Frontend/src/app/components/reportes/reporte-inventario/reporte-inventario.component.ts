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
    // 1) Si quisieras renombrar las claves, podrías mapear aquí.
    //    Pero si no, puedes usar this.inventario directamente.
    //    Asegúrate de que cada objeto tenga exactamente las propiedades:
    //    { Producto, StockActual, PrecioVenta, PrecioCosto, ValorTotal }
    const sheetData = this.inventario.map(item => ({
      Producto: item.Producto,
      StockActual: item.StockActual,
      PrecioVenta: item.PrecioVenta,
      PrecioCosto: item.PrecioCosto,
      ValorTotal: item.ValorTotal
    }));

    // 2) Generar la hoja con json_to_sheet (sin cellDates, ya que no hay fechas aquí)
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData);

    // 3) Obtener el rango de la hoja (ej.: "A1:E10")
    const rango = ws['!ref']!;
    const { s: start, e: end } = XLSX.utils.decode_range(rango);

    // 4) Recorrer cada fila (empezando en start.r + 1 porque la fila 0 es el encabezado)
    for (let fila = start.r + 1; fila <= end.r; ++fila) {
      // — Columna A "Producto" (índice 0): texto, no necesita formato especial.

      // — Columna B "StockActual" (índice 1): número entero, sin formato de moneda.
      const celdaStock = ws[XLSX.utils.encode_cell({ r: fila, c: 1 })];
      if (celdaStock) {
        celdaStock.t = 'n'; // garantizamos que sea numérico
        // Podrías agregar formato de miles con celdaStock.z = '#,##0'; si lo deseas.
      }

      // — Columna C "PrecioVenta" (índice 2): formato de moneda Q
      const celdaPrecioVenta = ws[XLSX.utils.encode_cell({ r: fila, c: 2 })];
      if (celdaPrecioVenta) {
        celdaPrecioVenta.t = 'n';
        celdaPrecioVenta.z = '"Q"#,##0.00';
      }

      // — Columna D "PrecioCosto" (índice 3): formato de moneda Q
      const celdaPrecioCosto = ws[XLSX.utils.encode_cell({ r: fila, c: 3 })];
      if (celdaPrecioCosto) {
        celdaPrecioCosto.t = 'n';
        celdaPrecioCosto.z = '"Q"#,##0.00';
      }

      // — Columna E "ValorTotal" (índice 4): formato de moneda Q
      const celdaValorTotal = ws[XLSX.utils.encode_cell({ r: fila, c: 4 })];
      if (celdaValorTotal) {
        celdaValorTotal.t = 'n';
        celdaValorTotal.z = '"Q"#,##0.00';
      }
    }

    // 5) Crear el libro y anexar la hoja
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    // 6) Descargar el archivo con el nombre deseado
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



