import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Jugador } from 'src/app/interfaces/Jugador';
import { Appointment } from 'src/app/interfaces/appointment';
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
      this.filterByDateAndPlayer();

      //2- si hay fecha
    } else if (getFilteredDate) {
      this.filterByDate()

      //3- se hay jugador
    } else if (getFilteredPlayer) {
      this.filterByPlayer()

    } else {
      console.log("***¡¡¡Filtrá los pagos!!!***")
    }

  }

  // Metodo donde se filtra por fecha y por jugador
  filterByDateAndPlayer() {
    const getFilteredDate = this.filterForm.get('filteredDate').value;
    const getFilteredPlayer = this.filterForm.get('filteredPlayer').value;

    const filteredAppointments = this.addAppointments.filter(ap => ap.appointmentStartDate === getFilteredDate);

    if (filteredAppointments && filteredAppointments.length > 0) {
      filteredAppointments.map(ap => {
        const player = ap.appointmentPlayers.find(p => p.playerId.toString() === getFilteredPlayer);

        if (player) {
          const selectedPlayer = player.playerId;
          const amountPaid = player.moneyPaid;
        }
      });
    } else {
      console.warn("*No se encontraron eventos con esa fecha*!!!")
    }
  }

  //Codigo listo donde se obtiene el id del jugador seleccionado en el select, los pagos realizados y su asistencia(opcional), a travez del input select
  filterByPlayer() {
    const getFilteredPlayer = this.filterForm.get('filteredPlayer').value;
    if (getFilteredPlayer) {
      const filteredPlayer = this.addAppointments.map((ap) => {

        const player = ap.appointmentPlayers.find((p) => p.playerId.toString() === getFilteredPlayer);

        if (player) {
          const selectedPlayer = player.playerId;
          const amountPaid = player.moneyPaid;

          return {
            player
          }
        } else {
          return null;
        }
      });
    }
  }

  //Codigo listo donde se obtiene el id de los jugadores que transcurrieron en esa fecha y el pago realizado por los mismos, a travez de la fecha ingresada en el input Date
  filterByDate() {
    const getFilteredDate = this.filterForm.get('filteredDate').value;
    if (getFilteredDate) {
      const filteredAppointments = this.addAppointments.filter(ap => ap.appointmentStartDate === getFilteredDate);

      //Obtengo el/los eventos de esa fecha
      if (filteredAppointments && filteredAppointments.length > 0) {
        //Recorro sobre los eventos filtrados
        filteredAppointments.forEach(ap => {
          const payments = ap.appointmentPlayers;

          //Recorro sobre los pagos de cada evento filtrado
          payments.forEach(payment => {
            const playerId = payment.playerId;
            const amountPaid = payment.moneyPaid;
          });
        });

      } else {
        console.warn("No se encontro evento con esa fecha");
      }

    } else {
      console.error("La fecha del filtro no es valida");
    }
  }
}
