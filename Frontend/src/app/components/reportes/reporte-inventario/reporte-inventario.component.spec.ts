import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioComponent } from './reporte-inventario.component';

describe('ReporteInventarioComponent', () => {
  let component: ReporteInventarioComponent;
  let fixture: ComponentFixture<ReporteInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteInventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
