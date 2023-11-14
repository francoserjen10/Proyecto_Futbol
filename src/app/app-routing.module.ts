import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { JugadoresComponent } from './component/jugadores/jugadores.component';
import { CalendarioDeAsistenciaComponent } from './component/calendario-de-asistencia/calendario-de-asistencia.component';
import { EntrenamientoComponent } from './component/entrenamiento/entrenamiento.component';
import { ContabilidadComponent } from './component/contabilidad/contabilidad.component';
import { JugadorComponent } from './component/jugador/jugador.component';
import { NuevoJugadorComponent } from './component/nuevo-jugador/nuevo-jugador.component';

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
