import { Injectable } from '@angular/core';
import { Jugador } from './interfaces/Jugador';

@Injectable({
  providedIn: 'root'
})
export class JugadoresService {

  //Atributo donde voy a almacenar los jugadores creados
  jugadores: Jugador[] = [
    {
      urlImagen: "",
      nombre: "",
      apellido: "",
      fechaDeNacimiento: "",
      club: "",
    }
  ];

  constructor() { }

  //Metodo donde le pasamos por parametro un jugador de tipo Jugador(interface) y guardamos ese jugador creado en el atributo jugadores
  agregarJugador(jugador : Jugador) {
    this.jugadores.push(jugador);
  };

  //Obtenemos los jugadores almacenados en el atributo jugadores
  obtenerJugadores() {
    return this.jugadores;
  }
}
