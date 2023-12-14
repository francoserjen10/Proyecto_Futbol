import { Component, OnInit } from '@angular/core';
import { Jugador } from 'src/app/interfaces/Jugador';
import { ActivatedRoute, Router } from '@angular/router';
import { JugadorService } from 'src/app/services/jugador.service';

@Component({
  selector: 'app-jugador',
  templateUrl: './jugador.component.html',
  styleUrls: ['./jugador.component.css'],
})
export class JugadorComponent implements OnInit {
  //Inicializo a jugador
  jugador: Jugador = {
    urlImagen: undefined,
    nombre: '',
    apellido: '',
    fechaDeNacimiento: '',
    club: ''
  }
  //Atributo donde se almacena el jugador seleccionado con el id correspondiente
  jugadorSeleccionado: Jugador | undefined;
  //atributo indice para recibir los jugadores con su id
  indice: number = 0;
  //Ruta alternativa de las imagenes para que puedan verse 
  imagesPath = '../assets/images/';

  //constructor
  constructor(
    private jugadorService: JugadorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  //Metodo que se ejecuta despues del constructor
  ngOnInit() {
    // this.almacenamientoDeIdJugadores();
    this.recibirJugador(this.route.snapshot.params['id']);
  }

  //Metodo que llama al servicio para obtener el jugador con su id y almacenarlo en jugadorSeleccionado
  recibirJugador(jugadorId: number) {
    // this.jugadorSeleccionado = this.jugadorService.encontrarJugadorPorId(this.indice);
    this.jugadorService.getJugadorById(jugadorId).subscribe((jugador) => {
      this.jugadorSeleccionado = jugador;

    });
  }

  //Metodo que se aplical al boton "Volver", donde escucha el evento click y actua volviendo al componente jugadores
  volverAJugadores() {
    this.router.navigate(['/jugadores']);
  }

  //Metodo que rescata los id de los jugadores creados que se encuentran en la URL
  almacenamientoDeIdJugadores() {
    this.indice = this.route.snapshot.params['id'];
  }

  //Metodo que se ejecuta al hacer click en el boton modificar. abre un modal con un formulario para editar el jugador
  modifyPlayer(jugador: Jugador) {
    //Obtengo los datos del jugador a modificar
    const modifiedPlayer: Jugador = {
      urlImagen: jugador.urlImagen,
      nombre: jugador.nombre,
      apellido: jugador.apellido,
      fechaDeNacimiento: jugador.fechaDeNacimiento,
      club: jugador.club
    }
    //Llamo al servicio para modificar el jugador
    this.jugadorService.updateJugador(modifiedPlayer).subscribe(() => {
      alert('Se actualizo el entrenamiento exitosamente');
    });
  }
}