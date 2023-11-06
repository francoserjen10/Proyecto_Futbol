import { Component, OnInit } from '@angular/core';
import { Jugador } from '../interfaces/Jugador';
import { JugadoresService } from '../JugadoresService';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css']
})

export class JugadoresComponent implements OnInit {

  //Creo arreglo de jugadores de tipo Jugador(interfaz)
  jugadores: Jugador[] = [
    {
      urlImagen: "",
      nombre: "",
      apellido: "",
      fechaDeNacimiento: "",
      club: "",
    }
  ];

  // constructor
  public constructor(private jugadoresService: JugadoresService) { }

  // Metodo ngOnInit donde va el codigo que quiero que se ejecute cuando el componente se inicialize
  ngOnInit(): void {
    this.extraerJugadores();
  };

  //Traigo todos los jugadores almacenados y los guardo en jugadores
  extraerJugadores() {
    this.jugadores = this.jugadoresService.obtenerJugadores();
  };
}
