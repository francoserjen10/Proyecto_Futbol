import { Component } from '@angular/core';
import { Jugador } from '../interfaces/Jugador';
import { JugadoresService } from '../JugadoresService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nuevo-jugador',
  templateUrl: './nuevo-jugador.component.html',
  styleUrls: ['./nuevo-jugador.component.css']
})
export class NuevoJugadorComponent {

  //Creamos atributo nuevoJugador de tipo Jugador(interface) con valores en "";
  nuevoJugador: Jugador = {
    urlImagen: "",
    nombre: "",
    apellido: "",
    fechaDeNacimiento: "",
    club: "",
  };

  //Inyectamos el servicio creado
  constructor(private jugadoresService: JugadoresService, private router: Router) { }

  //Metodo donde llamamos al servicio y traemos el metodo agregarJugador() donde almacena los jugadores creados
  agregarJugadores() {
    //Se agrega el jugador creado 
    this.jugadoresService.agregarJugador(this.nuevoJugador);
    //Al hacer click en el boton "Aceptar", vamos automaticamente al componente jugadores para poder verificar el jugador creado sin la necesidad de tener que navegar manualmente a travez del navbar
    this.router.navigate(['jugadores'])
  };

  // Metodo creado para reiniciar el formulario una vez completado el mismo
  reiniciarFormulario() {
    this.nuevoJugador = {
      urlImagen: "",
      nombre: "",
      apellido: "",
      fechaDeNacimiento: "",
      club: "",
    };
  }
}
