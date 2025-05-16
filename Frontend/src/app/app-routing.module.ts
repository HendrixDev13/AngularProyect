import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

// Guards
import { AuthGuard } from './utils/auth.guard';


// Reportes
import { ReporteVentasComponent } from './components/reportes/reporte-ventas/reporte-ventas.component';
import { ReporteGananciasComponent } from './components/reportes/reporte-ganancias/reporte-ganancias.component';
import { ReporteInventarioComponent } from './components/reportes/reporte-inventario/reporte-inventario.component';
import { ReporteCostoVentasComponent } from './components/reportes/reporte-costo-ventas/reporte-costo-ventas.component';
import { GraficoVentasComponent } from './components/reportes/grafico-ventas/grafico-ventas.component';
import { GraficoGananciasComponent } from './components/reportes/grafico-ganancias/grafico-ganancias.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'inventario',
    loadComponent: () => import('./components/list-products/list-products.component').then(m => m.ListProductsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ventas',
    component: VentasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [AuthGuard]
  },
    {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]  // <-- Aquí se aplica el guard
  },
  // app-routing.module.ts
{
  path: 'usuarios',
  loadComponent: () =>
    import('./components/usuarios/usuarios.component').then(m => m.UsuariosComponent),
  canActivate: [AuthGuard]
},
  // Reportes
  { path: 'reportes', component: ReportesComponent },
  { path: 'reportes/ventas', component: ReporteVentasComponent },
  { path: 'reportes/ganancias', component: ReporteGananciasComponent },
  { path: 'reportes/inventario', component: ReporteInventarioComponent },
  { path: 'reportes/costo-ventas', component: ReporteCostoVentasComponent },
  { path: 'reportes/grafico-ventas', component: GraficoVentasComponent },
  { path: 'reportes/grafico-ganancias', component: GraficoGananciasComponent },

  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
