import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { ReporteService } from '../../../services/reporte.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-grafico-ventas',
  standalone: false,
  templateUrl: './grafico-ventas.component.html',
  styleUrl: './grafico-ventas.component.css'
})
export class GraficoVentasComponent {

   chart: Chart | undefined;

  constructor(
    private reporteSrv: ReporteService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    // Al cargar la vista, obtenemos los datos
    this.reporteSrv.getGraficoVentas().subscribe({
      next: data => this.crearGrafico(data),
      error: () => alert('Error al cargar gráfico de ventas')
    });
  }

  crearGrafico(data: any[]): void {
    const labels = data.map(item => item.Mes);
    const valores = data.map(item => item.TotalVentas);

    // Destruimos gráfico previo si existe (para evitar duplicados al navegar)
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('graficoVentas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ventas Totales (Q)',
          data: valores,
          backgroundColor: '#4CAF50',
          borderColor: '#388E3C',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed.y || 0;
                return 'Q ' + value.toLocaleString('es-GT', { minimumFractionDigits: 2 });
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'Q ' + value.toLocaleString('es-GT');
              }
            }
          }
        }
      }
    });
  }

  regresarAReportes(): void {
    this.router.navigate(['/reportes']);
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    // Limpiar gráfico al salir del componente
    if (this.chart) {
      this.chart.destroy();
    }
  }

}
