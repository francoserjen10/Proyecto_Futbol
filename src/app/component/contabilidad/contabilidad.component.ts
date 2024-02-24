import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Jugador } from 'src/app/interfaces/Jugador';
import { Appointment } from 'src/app/interfaces/appointment';
import { PlayerPaymentInfo } from 'src/app/interfaces/player-payment-info';
import { AppointmentService } from 'src/app/services/appointment.service';
import { JugadorService } from 'src/app/services/jugador.service';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.css']
})
export class ContabilidadComponent {
  addAppointments: Appointment[];
  addPlayers: Jugador[];
  filteredInformation: PlayerPaymentInfo[] = [];
  filterForm: FormGroup;

  constructor(private appointmentService: AppointmentService, private playerService: JugadorService, private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      filteredDate: [''],
      filteredPlayer: ['']
    });
  }
  // #TODO:     
  //ngOnInit
  ngOnInit() {
    this.getAppointmentsAndPlayers();
  }

  getAppointmentsAndPlayers() {
    forkJoin({ appointments: this.appointmentService.getAllAppointments(), players: this.playerService.getAllJugadores() }).subscribe(results => {
      this.addAppointments = results.appointments;
      this.addPlayers = results.players;
    });
  }

  //Boton del filtro 
  applyFilter() {
    //Unificar los dos metodos de filtros (Player/Date)
    const getFilteredDate = this.filterForm.get('filteredDate').value;
    const getFilteredPlayer = this.filterForm.get('filteredPlayer').value;

    //1- si hay fecha y jugador
    if (getFilteredDate && getFilteredPlayer) {
      this.filteredInformation = [];
      this.filterByDateAndPlayer();

      //2- si hay fecha
    } else if (getFilteredDate) {
      this.filteredInformation = [];
      this.filterByDate();

      //3- se hay jugador
    } else if (getFilteredPlayer) {
      this.filteredInformation = [];
      this.filterByPlayer();

      //En el caso de que no se haya seleccionado ni fecha ni jugadores, al apretar el botón de filtrado, se limpia la tabla
    } else {
      this.filteredInformation = [];
    }

  }

  // Metodo donde se filtra por fecha y por jugador
  filterByDateAndPlayer() {
    const getFilteredDate = this.filterForm.get('filteredDate').value;
    const getFilteredPlayer = this.filterForm.get('filteredPlayer').value;

    const filteredAppointments = this.addAppointments.filter(ap => ap.appointmentStartDate === getFilteredDate);

    if (filteredAppointments && filteredAppointments.length > 0) {
      filteredAppointments.map(ap => {
        const player = ap.appointmentPlayers.find((p) => p.playerId.toString() === getFilteredPlayer);

        if (player) {
          //Comparo el id ya comparado anteriormente (del jugador encontrado), para obtener la informacion completa del jugador
          const selectedPlayerId = player.playerId;
          //Encuentro esa informacion del jugador en el listado de jugadores
          const selectedPlayer = this.addPlayers.find(player => player.id === selectedPlayerId);

          this.filteredInformation.push({
            playerName: selectedPlayer.nombre,
            playerLastName: selectedPlayer.apellido,
            playerDate: ap.appointmentStartDate,
            playerAmount: player.moneyPaid,
            playerId: player.playerId
          });

        } else {
          undefined;
          //#TODO: 
          //Corregir el alerta, porque al haber dos eventos en el mismo dia, si el jugador no asistió a ninguno, el alerta se repite la misma cantidad de veces que de eventos en ese dia
          alert(`El jugador seleccionado no asistió al entrenamiento`);
        }
      });
    } else {
      console.warn("*No se encontraron eventos con esa fecha*!!!")
    }
    return;
  }

  //Codigo listo donde se obtiene el id del jugador seleccionado en el select, los pagos realizados y su asistencia(opcional), a travez del input select
  filterByPlayer() {
    const getFilteredPlayer = this.filterForm.get('filteredPlayer').value;
    if (getFilteredPlayer) {
      const filteredPlayer = this.addAppointments.map((ap) => {

        const playerPayments = ap.appointmentPlayers.find((p) => p.playerId.toString() === getFilteredPlayer);

        if (playerPayments) {
          const selectedPlayerId = playerPayments.playerId;
          const selectedPlayer = this.addPlayers.find(player => player.id === selectedPlayerId);

          if (selectedPlayer) {
            this.filteredInformation.push({
              playerName: selectedPlayer.nombre,
              playerLastName: selectedPlayer.apellido,
              playerDate: ap.appointmentStartDate,
              playerAmount: playerPayments.moneyPaid,
              playerId: playerPayments.playerId
            });
          }

        } else {
          null;
        }
      });
    }
    return;
  }

  //Codigo listo donde se obtiene el id de los jugadores que transcurrieron en esa fecha y el pago realizado por los mismos, a travez de la fecha ingresada en el input Date
  filterByDate() {
    const getFilteredDate = this.filterForm.get('filteredDate').value;
    if (getFilteredDate) {
      const filteredAppointments = this.addAppointments.filter(ap => ap.appointmentStartDate === getFilteredDate);

      //Obtengo el/los eventos de esa fecha
      if (filteredAppointments && filteredAppointments.length > 0) {
        //Recorro sobre los eventos filtrados
        filteredAppointments.map(ap => {
          const payments = ap.appointmentPlayers;

          if (payments) {
            //Recorro sobre los pagos de cada evento filtrado
            payments.map(payment => {
              const selectedPlayerId = payment.playerId;
              const selectedPlayer = this.addPlayers.find(player => player.id === selectedPlayerId);

              if (selectedPlayer) {
                this.filteredInformation.push({
                  playerName: selectedPlayer.nombre,
                  playerLastName: selectedPlayer.apellido,
                  playerDate: ap.appointmentStartDate,
                  playerAmount: payment.moneyPaid,
                  playerId: payment.playerId
                });
              }
              //#TODO: Preguntar a tincho sobre el manejo de errores en este else 
            });
          }
          //#TODO: Preguntar a tincho sobre el manejo de errores en este else 
        });

      } else {
        console.warn("No se encontro evento con esa fecha");
      }

    } else {
      console.error("La fecha del filtro no es valida");
    }
    return;
  }
}
