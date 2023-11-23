import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JugadorComponent } from './component/jugador/jugador.component';
import { JugadoresComponent } from './component/jugadores/jugadores.component';
import { EntrenamientoComponent } from './component/entrenamiento/entrenamiento.component';
import { ContabilidadComponent } from './component/contabilidad/contabilidad.component';
import { HomeComponent } from './component/home/home.component';
import { NuevoJugadorComponent } from './component/nuevo-jugador/nuevo-jugador.component';
import { HttpClientModule } from '@angular/common/http';
import { CalendarComponent } from './component/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    JugadorComponent,
    JugadoresComponent,
    EntrenamientoComponent,
    ContabilidadComponent,
    HomeComponent,
    NuevoJugadorComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
