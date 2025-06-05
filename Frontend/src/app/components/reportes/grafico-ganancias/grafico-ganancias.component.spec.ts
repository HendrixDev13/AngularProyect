import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoGananciasComponent } from './grafico-ganancias.component';

describe('GraficoGananciasComponent', () => {
  let component: GraficoGananciasComponent;
  let fixture: ComponentFixture<GraficoGananciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraficoGananciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoGananciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
