import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCostoVentasComponent } from './reporte-costo-ventas.component';

describe('ReporteCostoVentasComponent', () => {
  let component: ReporteCostoVentasComponent;
  let fixture: ComponentFixture<ReporteCostoVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteCostoVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCostoVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
