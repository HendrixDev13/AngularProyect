import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../../services/reporte.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reporte-ventas',
  standalone: false,
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit {
  ventas: any[] = [];
  ventasOriginales: any[] = [];
  filtro = {
    desde: '',
    hasta: ''
  };
  // Fecha de la última generación (ya tenías esta variable):
  fechaGeneracion: string = '';

  // Nueva propiedad: la lista de logs completa
 // historialLogs: { id: number; desde: string | null; hasta: string | null; fecha_generacion: string }[] = [];

    primeraGeneracion: string | null = null;
    ultimaGeneracion: string | null = null;


  constructor(private reporteSrv: ReporteService, private router: Router) {}

  ngOnInit(): void {

   // Inicializamos todo igual que antes (sin filtro)
    this.filtro.desde = '';
    this.filtro.hasta = '';
    this.ventas = [];
    this.ventasOriginales = [];
    this.fechaGeneracion = '';
    this.primeraGeneracion = null;
    this.ultimaGeneracion = null;

    // Cargar histórico sin filtro (GET /ventas)
    this.reporteSrv.getVentasTotales().subscribe({
      next: data => {
        this.ventasOriginales = data;
        this.ventas = [...data];
      },
      error: () => alert('Error al cargar reporte de ventas')
    });
  }

  private dateToYYYYMMDD(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Convierte un string "yyyy-MM-dd" a la misma cadena sin desfase de zona.
   */
   private formatFechaParaBackend(fecha: string): string {
    const [y, m, d] = fecha.split('-').map(x => parseInt(x, 10));
    const localDate = new Date(y, m - 1, d);
    return localDate.toISOString().split('T')[0];
  }

  filtrarVentas(): void {
    if (!this.filtro.desde || !this.filtro.hasta) {
      alert('Debe seleccionar un rango de fechas');
      return;
    }

    const desdeForm = this.formatFechaParaBackend(this.filtro.desde);
    const hastaForm = this.formatFechaParaBackend(this.filtro.hasta);

    // 1) Ejecutar el reporte normal y obtener RESP { fechaGeneracion, data }
    this.reporteSrv.getVentasTotalesPorFechas(desdeForm, hastaForm).subscribe({
      next: resp => {
        this.fechaGeneracion = resp.fechaGeneracion;
        this.ventasOriginales = resp.data;
        this.ventas = [...resp.data];

        // 2) Inmediatamente pedimos primera/última generación para este mismo rango
        this.reporteSrv.getPrimerUltimoLogPorRango(desdeForm, hastaForm).subscribe({
          next: fechas => {
            this.primeraGeneracion = fechas.primeraFecha;  // puede ser string o null
            this.ultimaGeneracion = fechas.ultimaFecha;    // puede ser string o null
          },
          error: () => {
            console.error('Error al cargar primera/última generación del rango');
            this.primeraGeneracion = null;
            this.ultimaGeneracion = null;
          }
        });
      },
      error: () => {
        alert('Error al cargar reporte de ventas');
      }
    });
  }


  limpiarFiltro(): void {
    this.filtro.desde = '';
    this.filtro.hasta = '';
    this.fechaGeneracion = '';
    this.primeraGeneracion = null;
    this.ultimaGeneracion = null;

    // Vuelve a cargar todo el histórico sin filtro
    this.reporteSrv.getVentasTotales().subscribe({
      next: data => {
        this.ventasOriginales = data;
        this.ventas = [...data];
      },
      error: () => alert('Error al cargar reporte completo')
    });
  }

  exportarExcel(): void {
  // 1) Creamos la hoja a partir del JSON de ventas
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ventas);

  // 2) Renombramos las celdas de encabezado (fila 1)
  const headerMap: { [cell: string]: string } = {
    A1: 'Año',
    B1: 'Numero del Mes',
    C1: 'Nombre del Mes',
    D1: 'Total Ventas (Q)',
    E1: 'Porcentaje del año',
    F1: 'Fecha de Generación'
  };

  Object.keys(headerMap).forEach(cell => {
    if (ws[cell]) {
      ws[cell].v = headerMap[cell];
    }
  });

  // 3) Obtenemos el rango (número de filas y columnas) de la hoja
  const range = XLSX.utils.decode_range(ws['!ref']!);

  // 4) Aplicar formato a cada fila:
  //    - Columna D (índice 3) → moneda Q (#,##0.00 con prefijo "Q")
  //    - Columna E (índice 4) → porcentaje (0.00%)
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    // Celda de “Total Ventas” (columna D)
    const totalVentasCell = XLSX.utils.encode_cell({ r: row, c: 3 });
    if (ws[totalVentasCell]) {
      ws[totalVentasCell].t = 'n';             // marcamos la celda como "número"
      ws[totalVentasCell].z = '"Q"#,##0.00';   // formato moneda Quetzales
      // Nota: asumimos que el valor ya está en número, ej: 107353.00
    }

    // Celda de “% del año” (columna E)
    const porcentajeCell = XLSX.utils.encode_cell({ r: row, c: 4 });
    if (ws[porcentajeCell]) {
      // 4.a   Dividimos su valor entre 100 para que Excel lo entienda como porcentaje
      //       Ej: si el JSON venía 47.26 (representando 47.26%), al dividir por 100 obtenemos 0.4726,
      //       y con el formato "0.00%" Excel mostrará "47.26%".
      const valorOriginal: any = ws[porcentajeCell].v;
      if (typeof valorOriginal === 'number') {
        ws[porcentajeCell].v = valorOriginal / 100;
      }
      ws[porcentajeCell].t = 'n';            // marcamos la celda como "número"
      ws[porcentajeCell].z = '0.00%';        // formato porcentaje
    }
  }

  // 5) Crear el libro, anexar la hoja y descargarlo
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ventas Mensuales');
  XLSX.writeFile(wb, 'reporte-ventas.xlsx');
}



  regresarAReportes(): void {
    this.router.navigate(['/reportes']);
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getTotalGeneral(): number {
    return this.ventas.reduce((sum, v) => {
      const total = Number(v.TotalVentas) || 0;
      return sum + total;
    }, 0);
  }
}
