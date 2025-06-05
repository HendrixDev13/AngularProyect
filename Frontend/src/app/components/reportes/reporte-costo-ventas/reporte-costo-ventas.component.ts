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
  listaMesesDisponibles: string[] = [];
  mesSeleccionado: string = '';



  constructor(
    private reporteSrv: ReporteService,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.reporteSrv.getCostoVentas().subscribe({
    next: data => {
      this.datosOriginales = [...data];
      this.datos = [...data];

      // Generar lista de meses únicos para el combo
      this.listaMesesDisponibles = [...new Set(data.map(item => item.Mes))];

      // Ordenar por fecha real (más recientes primero)
      this.listaMesesDisponibles.sort((a, b) => {
        const [mesA, anioA] = a.split(' ');
        const [mesB, anioB] = b.split(' ');
        const fechaA = new Date(`${anioA}-${this.convertirMesANumero(mesA)}-01`);
        const fechaB = new Date(`${anioB}-${this.convertirMesANumero(mesB)}-01`);
        return fechaB.getTime() - fechaA.getTime(); // descendente
      });
    },
    error: () => alert('Error al cargar el reporte')
  });
}

  exportarExcel(): void {
  // 1️⃣ Construir datos con encabezados bonitos
  const sheetData = this.datos.map(item => ({
    'Mes': item.Mes,
    'Ventas Totales': item.TotalVentas,
    'Costo Total': item.CostoTotal,
    'Ganancia': item.Ganancia
  }));

  // 2️⃣ Crear hoja de Excel
  const ws = XLSX.utils.json_to_sheet(sheetData);

  // 3️⃣ Formatear columnas como moneda
  const rango = ws['!ref']!;
  const { s: start, e: end } = XLSX.utils.decode_range(rango);

  for (let fila = start.r + 1; fila <= end.r; fila++) {
    // Columna B (Ventas Totales)
    const celdaVentas = ws[XLSX.utils.encode_cell({ r: fila, c: 1 })];
    if (celdaVentas) {
      celdaVentas.t = 'n';
      celdaVentas.z = '"Q"#,##0.00';
    }

    // Columna C (Costo Total)
    const celdaCosto = ws[XLSX.utils.encode_cell({ r: fila, c: 2 })];
    if (celdaCosto) {
      celdaCosto.t = 'n';
      celdaCosto.z = '"Q"#,##0.00';
    }

    // Columna D (Ganancia)
    const celdaGanancia = ws[XLSX.utils.encode_cell({ r: fila, c: 3 })];
    if (celdaGanancia) {
      celdaGanancia.t = 'n';
      celdaGanancia.z = '"Q"#,##0.00';
    }
  }

  // 4️⃣ Crear libro y guardar
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


  convertirMesANumero(nombreMes: string): string {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const index = meses.indexOf(nombreMes.toLowerCase());
  return (index + 1).toString().padStart(2, '0'); // "01", "02", ..., "12"
}

aplicarFiltroMes(): void {
  if (!this.mesSeleccionado) {
    // Mostrar todo
    this.datos = [...this.datosOriginales];
  } else {
    // Filtrar por mes seleccionado
    this.datos = this.datosOriginales.filter(item => item.Mes === this.mesSeleccionado);
  }
}

limpiarFiltroMes(): void {
  this.mesSeleccionado = '';
  this.datos = [...this.datosOriginales];
}



}
