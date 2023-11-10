import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JugadorComponent } from './jugador/jugador.component';
import { JugadoresComponent } from './jugadores/jugadores.component';
import { CalendarioDeAsistenciaComponent } from './calendario-de-asistencia/calendario-de-asistencia.component';
import { EntrenamientoComponent } from './entrenamiento/entrenamiento.component';
import { ContabilidadComponent } from './contabilidad/contabilidad.component';
import { HomeComponent } from './home/home.component';
import { NuevoJugadorComponent } from './nuevo-jugador/nuevo-jugador.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    JugadorComponent,
    JugadoresComponent,
    CalendarioDeAsistenciaComponent,
    EntrenamientoComponent,
    ContabilidadComponent,
    HomeComponent,
    NuevoJugadorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
