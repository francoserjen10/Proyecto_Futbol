import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JugadorComponent } from './jugador/jugador.component';
import { JugadoresComponent } from './jugadores/jugadores.component';
import { CalendarioDeAsistenciaComponent } from './calendario-de-asistencia/calendario-de-asistencia.component';
import { EntrenamientoComponent } from './entrenamiento/entrenamiento.component';
import { ContabilidadComponent } from './contabilidad/contabilidad.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    JugadorComponent,
    JugadoresComponent,
    CalendarioDeAsistenciaComponent,
    EntrenamientoComponent,
    ContabilidadComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
