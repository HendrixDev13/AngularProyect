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
    hasta: '',
    mes: ''   // NUEVO
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
    // 1) Preparo un arreglo de objetos donde FechaGeneracion ya viene como Date
    const sheetData = this.ganancias.map(item => ({
      Producto: item.Producto,
      FechaVenta: new Date(item.FechaGeneracion),     // convierte "2025-05-20" → Date
      CantidadVendida: item.CantidadVendida,
      IngresoTotal: item.IngresoTotal,
      CostoTotal: item.CostoTotal,
      Ganancia: item.Ganancia
    }));

    // 2) Genero la hoja pasándole cellDates: true para que reconozca los Date
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData, { cellDates: true });

    // 3) Determino el rango de la hoja (ej. "A1:F10")
    const rango = ws['!ref']!;
    const { s: start, e: end } = XLSX.utils.decode_range(rango);

    // 4) Recorro cada fila (saltando la fila de encabezado)
    for (let fila = start.r + 1; fila <= end.r; ++fila) {
      // --- FORMATO DE FECHA en columna B (índice de columna 1) ---
      const celdaFecha = ws[XLSX.utils.encode_cell({ r: fila, c: 1 })];
      if (celdaFecha && celdaFecha.t === 'd') {
        // Indicamos a XLSX que utilice formato "dd/mm/yyyy"
        celdaFecha.z = 'dd/mm/yyyy';
      }

      // --- FORMATO DE MONEDA en columnas D, E y F (índices 3, 4, 5) ---
      [3, 4, 5].forEach(colIdx => {
        const celdaNum = ws[XLSX.utils.encode_cell({ r: fila, c: colIdx })];
        if (celdaNum && (celdaNum.t === 'n' || celdaNum.t === 's')) {
          // Aseguramos que sea número
          celdaNum.t = 'n';
          // Asignamos formato de moneda con símbolo Q y separador de miles
          celdaNum.z = '"Q"#,##0.00';
        }
      });
    }

    // 5) Preparo el libro y anexo la hoja
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ganancias');

    // 6) Finalmente, descargo el archivo
    XLSX.writeFile(wb, 'reporte-ganancias.xlsx');
  }

 filtrarGanancias(): void {
  if (!this.filtro.desde || !this.filtro.hasta) {
    alert('Debe seleccionar un rango de fechas');
    return;
  }

  this.reporteSrv.getGananciasDetallePorFechas(this.filtro.desde, this.filtro.hasta).subscribe({
    next: data => {
      this.ganancias = data;
    },
    error: () => alert('Error al filtrar ganancias')
  });
}



filtrarGananciasPorMes(): void {
  if (!this.filtro.mes) {
    alert('Debe seleccionar un mes');
    return;
  }

  this.reporteSrv.getGananciasDetallePorMes(this.filtro.mes).subscribe({
    next: data => {
      this.ganancias = data;
    },
    error: () => alert('Error al filtrar ganancias por mes')
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
