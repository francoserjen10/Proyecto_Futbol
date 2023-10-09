import { Component, OnInit } from '@angular/core';
import { JugadoresService } from '../JugadoresService';
import { Jugador } from '../interfaces/Jugador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jugador',
  templateUrl: './jugador.component.html',
  styleUrls: ['./jugador.component.css']
})
export class JugadorComponent implements OnInit {

  //Atributos de arreglo de jugadores para poder almacenarlos en algun lugar
  jugador: Jugador[] = [];

  //constructor
  constructor(private jugadorService: JugadoresService, private router: Router) { }

  //Metodo que se ejecuta despues del constructor
  ngOnInit() {
    this.recibirJugador();
  }

  //Metodo que llama al servicio para obtener los jugadores y almacenarlos en el arreglo jugador
  recibirJugador() {
    this.jugador = this.jugadorService.obtenerJugadores();
  }

  //Metodo que se aplical al boton "Volver", donde escucha el evento click y actua volviendo al componente jugadores
  volverAJugadores() {
    this.router.navigate(['/jugadores']);
  }
}
