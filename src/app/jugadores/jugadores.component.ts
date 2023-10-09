import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public constructor(private router: Router, private jugadoresService: JugadoresService) { }

  // Metodo nfOnInit donde va el codigo que quiero que se ejecute cuando el componente se inicialize
  ngOnInit(): void {
    //Traigo todos los jugadores almacenados y los guardo en jugadores
    this.jugadores = this.jugadoresService.obtenerJugadores();
  };

  // Metodo donde se ejecuta cuando se hace click en el boton e ingresa al componente Jugador
  ingresarAJugador() {
    this.router.navigate(['/jugador'])
  };
}
