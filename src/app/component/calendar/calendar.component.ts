import { Component, ViewChild } from '@angular/core';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Appointment } from 'src/app/interfaces/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { JugadorService } from 'src/app/services/jugador.service';
import { Jugador } from 'src/app/interfaces/Jugador';
import { PlayerPaymentsService } from 'src/app/services/player-payments.service';
import { PlayerPayment } from 'src/app/interfaces/player-payment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {

  @ViewChild('exampleModalModification') exampleModalModification: ElementRef;

  // ---------------------------------------------------- Inicializacion de interfaz  ----------------------------------------------------
  //Inicializacion de la interfas
  appointment: Appointment | undefined;

  // ---------------------------------------------------- Variables donde almaceno eventos y jugadores ----------------------------------------------------
  //Variable donde guardo todos los eventos
  appointments: Appointment[] = [];
  //Variable donde guardo todos los jugadores
  players: Jugador[];
  //Variable donde guardo todos los jugadores
  appointmentsWithPlayers: any[];



  //Variable donde guardo los pagos de los jugadores
  payments: PlayerPayment[];


  //Almaceno el id del evento seleccionado
  selectedAppointmentId: number;

  handleEventClick = (info: any) => {
    // --------------------------------- Appointment ---------------------------------
    //Le asigno el appointment seleccionado
    const appointment = info.event;

    // --------------------------------- Appointment Id ---------------------------------
    //Le asigno el id del appointment seleccionado
    this.selectedAppointmentId = info.event.id;
    // --------------------------------- Appointment Date/Hour ---------------------------------
    // toISOString() = Se usa para formatear un objeto de fecha en una cadena de texto en formato de fecha ISO
    // .split('T')[0] = Y aca se quiere extraer solo la parte de la fecha y asi puede aparecer en el formulario
    this.appointment.appointmentStartDate = appointment.start.toISOString().split('T')[0];
    // [1] = accede al segundo elemento del arreglo que es la parte de la hora
    // .substring(0, 5) = toma los primeros 5 caracteres de la cadena de la hora que en el formato ISO, representa las dos primeras cifras del valor de la hora
    this.appointment.appointmentStartTime = appointment.start.toISOString().split('T')[1].substring(0, 5);
    this.appointment.appointmentEndTime = appointment.end.toISOString().split('T')[1].substring(0, 5);

    // --------------------------------- Appointment title ---------------------------------
    //Le asigna la información de los jugadores seleccionados a this.appointment.appointmentPlayers
    this.appointment.appointmentPlayers = appointment.title;

    // --------------------------------- Open modification form ---------------------------------
    //Abro el modal del formulario de modificacion
    const modal = new bootstrap.Modal(this.exampleModalModification.nativeElement);
    modal.show();
  };

  //Desde aca se obtiene la funcionalidad de la libreria del calendario (Plugins, botones, funcionalidad para correr entre los dias, semanas, meses, años)
  calendarOptions: CalendarOptions = {
    //Plugins para los botones
    plugins:
      [dayGridPlugin, timeGridPlugin, interactionPlugin],
    //Header del calendario, donde tengo los botones para correr el mes, acceder al dia de hoy y seleccionar si queres que el calendario te muestre el mes, la semana, el dia y la lista de appointments.
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth, timeGridWeek, timeGridDay'
    },
    //Se muestra el mes completo por defecto
    initialView: 'dayGridMonth',
    //Muestro la semana completa en true o muestro 5 dias en false
    weekends: true,
    //Arreglo de eventos (appointments). (Los appointments que contiene el calendario)
    events: [],
    //Idioma del calendario
    locale: esLocale,

    // ----------------PARA MOSTRAR PROPIEDADES DE LOS EVENTOS-----------------
    // Se declara en true para que aparezca el horario de finalizacion de los appointments
    forceEventDuration: true,

    // ----------------EDICION DE APPOINTMENTS-----------------
    //Para arrastrar o cambiar de tamaño los appointments
    editable: true,
    //Permite editar la duracion de los appointments arrastrandolos
    eventDurationEditable: true,
    //Permite editar la hora de inicio de los appointments arrastrandolos
    eventStartEditable: true,

    // ----------------PARA MOSTRAR INFORMACION DE LOS APPOINTMENTS EN CONSOLA-----------------
    eventClick: this.handleEventClick,
  };

  constructor(private appointmentService: AppointmentService, private playerService: JugadorService, private paymentsService: PlayerPaymentsService) { }

  // En el ngOnInit, al recargar la pagina se ejecutara primero
  ngOnInit(): void {
    this.getEventsAndPlayers();
    this.setEventsAndPlayers()
  }

  // ---------------------------------------------------- Obtencion de Appointments y Players al mismo tiempo (forkJoin) ----------------------------------------------------
  getEventsAndPlayers() {
    // obtengo eventos y jugadores al mismo tiempo
    forkJoin({ players: this.playerService.getAllJugadores(), appointments: this.appointmentService.getAllAppointments() }).subscribe(results => {
      //Le asigno los eventos a la variable appointments
      this.appointments = results.appointments;
      //Le asigno los jugadores a la variable players
      this.players = results.players;
      //Armo el vento con los jugadores seleccionados y con la informacion de cada uno
      this.appointmentsWithPlayers = results.appointments.map((appointment) => { //Recorro evento por evento
        return {
          ...appointment,
          appointmentPlayers: appointment.appointmentPlayers.map((player) => { //Recorro lista de jugadores dentro de cada evento
            const playerInfo = results.players.find((value) => value.id === player.playerId);
            if (playerInfo) {
              return {
                ...player,
                playerWhoAttended: {
                  name: playerInfo.nombre,
                  lastName: playerInfo.apellido,
                  id: playerInfo.id
                },
              };
            }
            return player;
          }),
        }
      });
    })
  }

  // ---------------------------------------------------- Seteo la información de los servicios, al calendario ----------------------------------------------------
  setEventsAndPlayers() {
    //Verifico se this.appointmentsWithPlayers existe
    if (this.appointmentsWithPlayers && this.appointmentsWithPlayers.length > 0) {
      //Armo el evento con los jugadores y su información
      const setAppointmentWithPlayers: EventSourceInput = this.appointmentsWithPlayers.map(appointment => {
        const playersString = Array.isArray(appointment.appointmentPlayers) ? appointment.appointmentPlayers.map(value => `${value.playerWhoAttended.name} ${value.playerWhoAttended.lastName}`).join(", ") : '';
        return {
          //Se le pasa los datos del nuevo appointment a la informacion del calendario
          title: playersString,
          start: appointment.appointmentStartDate + ' ' + appointment.appointmentStartTime,
          end: appointment.appointmentStartDate + ' ' + appointment.appointmentEndTime,
          id: appointment.id
        };
      })
      //Le asigno los eventos con diuchos jugadores y su información a la propiedad que pertenece a FullCalendar "events"
      this.calendarOptions.events = setAppointmentWithPlayers;
    }
  }

  // ---------------------------------------------------- Creación de Appointment ----------------------------------------------------
  //Creo tarea y actualizo el calendario
  createAppointment(appointment: Appointment): void {
    //Tengo un appointment nuevo
    const newAppointment: Appointment = {
      appointmentPlayers: appointment.appointmentPlayers,
      appointmentStartDate: appointment.appointmentStartDate,
      appointmentStartTime: appointment.appointmentStartTime,
      appointmentEndTime: appointment.appointmentEndTime
    };
    // #TODO (opcional): Se puede agregar una validación para saber si el formulario que envió está ok
    //Llamo al servicio
    this.appointmentService.createAppointment(appointment).subscribe({
      next(appointment) {
        alert('Se creó el Entrenamiento exitosamente');
      },
      error(err) {
        console.error(err);
        alert('Ocurrió un error al intentar crear el jugEntrenamientoador');
      },
    });
  }

  // ---------------------------------------------------- Actualización de Appointments ----------------------------------------------------
  //CRUD: "ACTUALIZAR"
  updateAppointmentsInCalendar(appointment: Appointment) {
    // Modifico el evento
    const appointmentModified: Appointment = {
      appointmentPlayers: appointment.appointmentPlayers,
      appointmentStartDate: appointment.appointmentStartDate,
      appointmentStartTime: appointment.appointmentStartTime,
      appointmentEndTime: appointment.appointmentEndTime,
      id: this.selectedAppointmentId
    };

    //  llamo al servicio
    this.appointmentService.updateEAppointments(appointmentModified).subscribe(() => {
      alert('Se actualizo el entrenamiento exitosamente');
    })
    //  Cierro el modal del formulario de modificacion despues de borrar
    const modal = new bootstrap.Modal(this.exampleModalModification.nativeElement);
    modal.hide();
  }

  // ---------------------------------------------------- Borrar Appointments ----------------------------------------------------
  // CRUD: "BORRAR"
  deleteAppointmentInCalendar(appointmentId: number): void {
    this.appointmentService.deleteAppointmentsById(appointmentId).subscribe(() => {
      alert('Se elimino el entrenamiento exitosamente');
    });
    //  Cierro el modal del formulario de modificacion despues de borrar
    const modal = new bootstrap.Modal(this.exampleModalModification.nativeElement);
    modal.hide();
  }
}