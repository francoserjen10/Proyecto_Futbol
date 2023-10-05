import { Component } from '@angular/core';
import { Jugador } from '../interfaces/Jugador';
import { JugadoresService } from '../jugadores.service';

@Component({
  selector: 'app-nuevo-jugador',
  templateUrl: './nuevo-jugador.component.html',
  styleUrls: ['./nuevo-jugador.component.css']
})
export class NuevoJugadorComponent {

  //Creamos atributo nuevoJugador de tipo Jugador(interface) con valores en "";
   private nuevoJugador: Jugador = {
     urlImagen: "",
     nombre: "",
     apellido: "",
     fechaDeNacimiento: "",
     club: "",
   }

   //Inyectamos el servicio creado
   constructor(private jugadoresService:JugadoresService) { }
  
   //Metodo donde llamamos al servicio y traemos el metodo agregarJugador() donde almacena los jugadores creados
  agregarJugadores() {
    this.jugadoresService.agregarJugador(this.nuevoJugador);
   };

   //Metodo creado para reiniciar el formulario una vez completado el mismo
   reiniciarFormulario(){
    this.nuevoJugador = {
      urlImagen: "",
      nombre: "",
      apellido: "",
      fechaDeNacimiento: "",
      club: "",
    }
   }
}
