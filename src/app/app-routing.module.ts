import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { JugadoresComponent } from './jugadores/jugadores.component';
import { CalendarioDeAsistenciaComponent } from './calendario-de-asistencia/calendario-de-asistencia.component';
import { EntrenamientoComponent } from './entrenamiento/entrenamiento.component';
import { ContabilidadComponent } from './contabilidad/contabilidad.component';
import { JugadorComponent } from './jugador/jugador.component';
import { NuevoJugadorComponent } from './nuevo-jugador/nuevo-jugador.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'jugadores', component: JugadoresComponent },
  { path: 'calendarioDeAsistencia', component: CalendarioDeAsistenciaComponent },
  { path: 'entrenamiento', component: EntrenamientoComponent },
  { path: 'contabilidad', component: ContabilidadComponent },
  { path: 'jugador/:id', component: JugadorComponent },
  { path: 'nuevo-jugador', component: NuevoJugadorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
