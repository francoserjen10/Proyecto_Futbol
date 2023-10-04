import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css']
})

export class JugadoresComponent {

  // constructor
  public constructor(private router: Router) { }

  // Metodo donde se ejecuta cuando se hace click en el boton e ingresa al componente Jugador
  ingresarAJugador() {
    this.router.navigate(['/jugador'])
  };
}
