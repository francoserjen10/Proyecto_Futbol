import { Component } from '@angular/core';
import { Jugador } from '../interfaces/Jugador';

@Component({
  selector: 'app-nuevo-jugador',
  templateUrl: './nuevo-jugador.component.html',
  styleUrls: ['./nuevo-jugador.component.css']
})
export class NuevoJugadorComponent {

   nuevoJugador: Jugador = {
     urlImagen: "",
     nombre: "",
     apellido: "",
     fechaDeNacimiento: "",
     club: "",
   }
}
