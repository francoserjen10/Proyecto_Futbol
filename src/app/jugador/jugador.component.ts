import { Component, OnInit } from '@angular/core';
import { JugadoresService } from '../JugadoresService';
import { Jugador } from '../interfaces/Jugador';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-jugador',
  templateUrl: './jugador.component.html',
  styleUrls: ['./jugador.component.css']
})
export class JugadorComponent implements OnInit {

  //Atributo donde se almacena el jugador seleccionado con el id correspondiente
  jugadorSeleccionado: Jugador | undefined;

  //atributo indice para recibir los jugadores con su id
  indice:number = 0;

  //constructor
  constructor(private jugadorService: JugadoresService, private router: Router, private route:ActivatedRoute) { }

  //Metodo que se ejecuta despues del constructor
  ngOnInit() {
    this.almacenamientoDeIdJugadores();
    this.recibirJugador();
  }

  //Metodo que llama al servicio para obtener el jugador con su id y almacenarlo en jugadorSeleccionado
  recibirJugador() {
    this.jugadorSeleccionado = this.jugadorService.encontrarJugadorPorId(this.indice);
  }

  //Metodo que se aplical al boton "Volver", donde escucha el evento click y actua volviendo al componente jugadores
  volverAJugadores() {
    this.router.navigate(['/jugadores']);
  }

  //Metodo que rescata los id de los jugadores creados que se encuentran en la URL
  almacenamientoDeIdJugadores() {
    this.indice = this.route.snapshot.params['id'];
  }
}
