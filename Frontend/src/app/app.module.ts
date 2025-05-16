import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


//Modulos
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


//Componentes
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component'; // Asegurate de que existe
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { AddTokenInterceptor } from './utils/add-token.interceptor';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { AddEditProductComponent } from './components/add-edit-product/add-edit-product.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ReporteVentasComponent } from './components/reportes/reporte-ventas/reporte-ventas.component';
import { ReporteGananciasComponent } from './components/reportes/reporte-ganancias/reporte-ganancias.component';
import { ReporteInventarioComponent } from './components/reportes/reporte-inventario/reporte-inventario.component';
import { ReporteCostoVentasComponent } from './components/reportes/reporte-costo-ventas/reporte-costo-ventas.component';
import { GraficoVentasComponent } from './components/reportes/grafico-ventas/grafico-ventas.component';
import { GraficoGananciasComponent } from './components/reportes/grafico-ganancias/grafico-ganancias.component';
import { NgChartsModule } from 'ng2-charts';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    SpinnerComponent,
    AddEditProductComponent,
    VentasComponent,
    ReportesComponent,
    ReporteVentasComponent,
    ReporteGananciasComponent,
    ReporteInventarioComponent,
    ReporteCostoVentasComponent,
    GraficoVentasComponent,
    GraficoGananciasComponent,



  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }), // Por ahora rutas vacías, podemos agregarlas luego
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule,],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true}, // Asegúrate de importar el interceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
