import { Injectable } from '@angular/core';
import { Jugador } from './interfaces/Jugador';

@Injectable({
  providedIn: 'root'
})
export class JugadoresService {

  //Atributo donde voy a almacenar los jugadores creados
  jugadores: Jugador[] = [];

  constructor() { }

  //Metodo donde le pasamos por parametro un jugador de tipo Jugador(interface) y guardamos ese jugador creado en el atributo jugadores
  agregarJugador(jugador: Jugador) {
    this.jugadores.push(jugador);
  };

  //Obtenemos los jugadores almacenados en el atributo jugadores
  obtenerJugadores() {
    return this.jugadores;
  }

  //Metodo donde se va a ubicar al jugador con su id correspondiente dentro del arreglo de jugadores
  encontrarJugadorPorId(indice: number) {
    let jugador: Jugador = this.jugadores[indice];
    return jugador;
  };
}
