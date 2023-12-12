import { Component, OnInit } from '@angular/core';
import { Jugador } from 'src/app/interfaces/Jugador';
import { JugadorService } from 'src/app/services/jugador.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css'],
})
export class JugadoresComponent implements OnInit {
  //Creo arreglo de jugadores de tipo Jugador(interfaz)
  jugadores: Jugador[] = [
    {
      urlImagen: '',
      nombre: '',
      apellido: '',
      fechaDeNacimiento: '',
      club: '',
    },
  ];
  //Ruta alternativa de las imagenes para que puedan verse 
  imagesPath = '../assets/images/';

  // constructor
  constructor(private jugadorService: JugadorService) { }

  // Metodo ngOnInit donde va el codigo que quiero que se ejecute cuando el componente se inicialize
  ngOnInit(): void {
    this.extraerJugadores();
  }

  //Traigo todos los jugadores almacenados y los guardo en jugadores
  extraerJugadores() {
    this.jugadorService
      .getAllJugadores()
      .pipe(take(1))
      .subscribe((value) => {
        this.jugadores = value;
      });
  }

  //Eliminar Jugadores
  public deleteJugador(jugadorId: number): void {
    this.jugadorService.deleteJugadorById(jugadorId).subscribe(() => {
      alert('Se borró al jugador con éxito');
      this.extraerJugadores();
    });
  }
}
