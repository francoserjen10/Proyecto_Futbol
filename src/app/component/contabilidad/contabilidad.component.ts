import { Component } from '@angular/core';
import { AssistedPlayer } from 'src/app/interfaces/assisted-player';
import { PlayerPayment } from 'src/app/interfaces/player-payment';
import { PlayerPaymentsService } from 'src/app/services/player-payments.service';
import { PlayerAsisstanceService } from 'src/app/services/player-asisstance.service';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.css']
})
export class ContabilidadComponent {
  // --------------------- Asistencias ---------------------
  asisstances: AssistedPlayer[] = [];
  newAsisstance = {} as AssistedPlayer;
  // --------------------- Pagos ---------------------
  payments: PlayerPayment[] = [];
  newPayment = {} as PlayerPayment;
  // --------------------- Mostrar formulario ---------------------
  showForm: boolean = false;

  constructor(private playerPaymentsService: PlayerPaymentsService, private playerAsisstancesService: PlayerAsisstanceService) { }

  ngOnInit(): void {
    this.obtainPlayerAsisstanceAndPayment();
  }

  // ------------------------------------------ Crear pago y asistencia del jugador ------------------------------------------
  //Se crea el pago del jugador
  createPlayerPayment(): void {
    this.playerPaymentsService.createPlayerPayments(this.newPayment).subscribe({
      next(pay) {
        alert("Se agrego el pago del jugador");
      },
      error(err) {
        alert('Ocurrio un error al agregar el pago del jugador');
      }
    });
    // Agrego el nuevo pago del jugador creado, al arreglo de los pagos de jugadores
    this.payments.push(this.newPayment);
    //Limpio el nuevo pago del jugador despues de haber creado uno
    this.newPayment = {} as PlayerPayment;
  }

  //Se crea la asistencia del jugador
  createPlayerAsisstance(): void {
    this.playerAsisstancesService.createPlayerAsisstance(this.newAsisstance).subscribe({
      next(asisstance) {
        alert("Se agrego la asistencia del jugador");
      },
      error(err) {
        alert('Ocurrio un error la asistencia el pago del jugador');
      }
    });
    // Agrego la nueva asistencia del jugador creado al arreglo de las asistencias de los jugadores
    this.asisstances.push(this.newAsisstance);
    //Limpio la nueva asistencia del jugador despues de haber creado una
    this.newAsisstance = {} as AssistedPlayer;
  }

  //Vinculacion de los dos metodos de creacion
  createPlayerAsisstanceAndPayment(): void {
    this.createPlayerAsisstance();
    this.createPlayerPayment();
  }

  // ------------------------------------------ Obtener pagos y asistencias ------------------------------------------
  //Obtengo todos los pagos de los jugadores
  obtainPlayersPayments(): void {
    this.playerPaymentsService.getAllPlayerPayments().subscribe((value) => {
      this.payments = value;
    });
  }

  //Obtengo todas las asistencias de los jugadores
  obtainPlayersAsisstances(): void {
    this.playerAsisstancesService.getAllPlayerAsisstances().subscribe((value) => {
      this.asisstances = value;
    });
  }

  //Vinculacion de los dos metodos de obtencion
  obtainPlayerAsisstanceAndPayment(): void {
    this.obtainPlayersAsisstances();
    this.obtainPlayersPayments();
  }

  // ------------------------------------------ Elimino pagos y asistencias ------------------------------------------
  //Elimino el pago del jugador
  deletePlayerPayment(playerPaymentId: number) {
    this.playerPaymentsService.deletePlayerPaymentsById(playerPaymentId).subscribe(() => {
      alert('Pago del jugador eliminado');
      this.obtainPlayersPayments();
    });
  }

  //Elimino la asistencia del jugador
  deletePlayerAsisstance(playerAsisstanceId: number) {
    this.playerAsisstancesService.deletePlayerAsisstancesById(playerAsisstanceId).subscribe(() => {
      alert('Asistencia del jugador eliminado');
      this.obtainPlayersAsisstances();
    });
  }

  //Vinculacion de los dos metodos de Eliminacion
  deletePlayerAsisstanceAndPayment(playerId: number): void {
    this.deletePlayerAsisstance(playerId);
    this.deletePlayerPayment(playerId);
  }
  // ------------------------------------------ Abro/Cierro formulario ------------------------------------------
  //Abrir y cerrar el formulario 
  OpenForm() {
    this.showForm = !this.showForm;
  }
}
