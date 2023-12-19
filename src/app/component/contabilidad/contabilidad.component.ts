import { Component, OnInit } from '@angular/core';
import { AssistedPlayer } from 'src/app/interfaces/assisted-player';
import { PlayerPaymentsService } from 'src/app/services/player-payments.service';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.css']
})
export class ContabilidadComponent {
  players: AssistedPlayer[] = [];
  newPlayer = {} as AssistedPlayer;
  showForm: boolean = false;

  constructor(private playerPaymentsService: PlayerPaymentsService) { }

  ngOnInit(): void {
    this.obtainPlayersPayments();
  }

  //Se crea el pago del jugador
  createPlayerPayment(): void {
    this.playerPaymentsService.createPlayerPayments(this.newPlayer).subscribe({
      next(player) {
        console.log("Pago del jugador creado", player);
        alert("Se agrego el pago del jugador");
      },
      error(err) {
        alert('Ocurrio un error al agregar el pago del jugador');
      }
    });
    // Agrego el nuevo jugador creado al arreglo de los jugadores
    this.players.push(this.newPlayer);
    //Limpio el nuevo jugador despues de haber creado uno
    this.newPlayer = {} as AssistedPlayer;
  }

  //Obtengo todos los jugadores y sus pagos desde el json
  obtainPlayersPayments(): void {
    this.playerPaymentsService.getAllPlayerPayments().subscribe((value) => {
      this.players = value;
    });
  }

  //Elimino el jugador y su pago
  deletePlayerPayment(playerPaymentId: number) {
    this.playerPaymentsService.deletePlayerPaymentsById(playerPaymentId).subscribe(() => {
      alert('Pago del jugador eliminado');
      this.obtainPlayersPayments();
    });
  }

  //Abrir y cerrar el formulario 
  OpenForm() {
    this.showForm = !this.showForm;
  }
}
