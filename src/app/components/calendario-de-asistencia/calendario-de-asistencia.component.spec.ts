import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioDeAsistenciaComponent } from './calendario-de-asistencia.component';

describe('CalendarioDeAsistenciaComponent', () => {
  let component: CalendarioDeAsistenciaComponent;
  let fixture: ComponentFixture<CalendarioDeAsistenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarioDeAsistenciaComponent]
    });
    fixture = TestBed.createComponent(CalendarioDeAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
