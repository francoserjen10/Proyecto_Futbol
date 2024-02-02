import { Component, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';

import { CalendarOptions, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Appointment } from 'src/app/interfaces/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { JugadorService } from 'src/app/services/jugador.service';
import { Jugador } from 'src/app/interfaces/Jugador';
import { PlayerPaymentsService } from 'src/app/services/player-payments.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {

  @ViewChild('exampleModalModification') exampleModalModification: ElementRef;

  newAppointmentForm: FormGroup;
  // ---------------------------------------------------- Inicializacion de interfaz  ----------------------------------------------------
  //Inicializacion de la interfas
  //Tambien la puedo usar para limpiar el formulario
  // ""--Es un objeto vacio--""
  appointment = {} as Appointment | undefined;
  // ---------------------------------------------------- Variables donde almaceno appointment y jugadores ----------------------------------------------------
  //Variable donde guardo todos los appointment
  allAppointments: Appointment[];
  //Variable donde guardo todos los jugadores
  allPlayers: Jugador[];
  // Variable donde guardo el appointment con los jugadores
  combinedAppointmentsWithPlayers: Appointment[] | undefined;
  //variable donde guardo los jugadores seleccionados en el select de asistencia
  selectedPlayers: string[] | undefined;
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

  constructor(
    private appointmentService: AppointmentService,
    private playerService: JugadorService,
    private paymentsService: PlayerPaymentsService,
    public formBuilder: FormBuilder
  ) {
    this.newAppointmentForm = this.formBuilder.group({
      appointmentStartDate: [''],
      appointmentStartTime: [''],
      appointmentEndTime: [''],
      attendanceAndPayments: this.formBuilder.array([])
    })
  }

  ngOnInit(): void {
    this.getAppointmentsAndPlayers();
  }

  // ---------------------------------------------------- Obtencion de Appointments y Players al mismo tiempo (forkJoin) ----------------------------------------------------
  getAppointmentsAndPlayers() {
    // obtengo citas y jugadores al mismo tiempo
    forkJoin({ players: this.playerService.getAllJugadores(), appointments: this.appointmentService.getAllAppointments() }).subscribe(results => {
      this.allPlayers = results.players;
      this.allAppointments = results.appointments;

      // Armo el objeto de appointments y players juntos
      this.combinedAppointmentsWithPlayers = this.allAppointments.map((appointment) => {

        // Armo la parte del objeto de appointmentPlayers, comparando el id del listado de jugadores con el id que le llega a appointmentPlayers
        return {
          ...appointment,
          appointmentPlayers: appointment.appointmentPlayers.map((playerIdOfAppointment) => {
            const playerIdComparison = this.allPlayers.filter((player) => {
              return player.id === playerIdOfAppointment.playerId;
            })
            return {
              ...playerIdOfAppointment
            }
          })
        }
      })
      //Seteo eventos y jugadores al calendario
      this.setAppointmentsAndPlayers();
      return this.combinedAppointmentsWithPlayers;
    });

  }

  // ---------------------------------------------------- Seteo la información de los servicios, al calendario ----------------------------------------------------
  setAppointmentsAndPlayers() {
    if (this.combinedAppointmentsWithPlayers && this.combinedAppointmentsWithPlayers.length > 0) {
      const setAppointmentWithPlayers: EventSourceInput = {
        events: this.combinedAppointmentsWithPlayers.map((appointment) => {
          //Mapeo los jugadores
          const playerProperty = appointment.appointmentPlayers.map((playerIdOfAppointmentPlayer) => {
            const playerFiltered = this.allPlayers.filter((player) => player.id === playerIdOfAppointmentPlayer.playerId);
            return playerFiltered.map((p) => `${p.nombre} ${p.apellido}`).join(', ');
          }).join(', ');

          return {
            title: playerProperty,
            start: appointment.appointmentStartDate + ' ' + appointment.appointmentStartTime,
            end: appointment.appointmentStartDate + ' ' + appointment.appointmentEndTime,
            id: appointment.id.toString()
          }
        })
      };
      this.calendarOptions.events = setAppointmentWithPlayers.events;
    }
  }

  //Obtengo por id la partde del formulario de asistencias y pagos de los jugadores
  getAttendancesAndPayments(): FormArray {
    return this.newAppointmentForm.get('attendanceAndPayments') as FormArray;
  }

  // Inserto las propiedades de appointmentPlayers a la parte del formulario obtenido por id
  addAttendancesAndPayments() {
    this.getAttendancesAndPayments().push(this.newAttendanceAndPayment());
  }

  //Inicializo las propiedades de appointmentPlayers
  newAttendanceAndPayment() {
    return this.formBuilder.group({
      playerId: 0,
      moneyPaid: 0,
      attended: false
    });
  }

  // ---------------------------------------------------- Creación de Appointment ----------------------------------------------------
  //Creo tarea y actualizo el calendario
  createAppointment(appointment: Appointment): void {
    //Creo un nuevo objeto appointment
    const newAppointment: Appointment = {
      appointmentPlayers: this.newAppointmentForm.get('attendanceAndPayments').value.map(playerData => ({
        playerId: parseInt(playerData.playerId),
        moneyPaid: playerData.moneyPaid,
        attended: playerData.attended
      })),
      appointmentStartDate: this.newAppointmentForm.get('appointmentStartDate').value,
      appointmentStartTime: this.newAppointmentForm.get('appointmentStartTime').value,
      appointmentEndTime: this.newAppointmentForm.get('appointmentEndTime').value
    }

    if (this.newAppointmentForm?.valid) {
      // Llamo al servicio
      this.appointmentService.createAppointment(newAppointment).subscribe({
        next(appointment) {
          alert('Se creó el Entrenamiento exitosamente');
        },
        error(err) {
          console.error(err);
          alert('Ocurrió un error al intentar crear el jugEntrenamientoador');
        },
      });
    }
    //Actualizo la lista de appointments y players
    this.getAppointmentsAndPlayers();
    //Limpio el formulario
    this.newAppointmentForm.reset();
  }

  // ---------------------------------------------------- Actualización de Appointments ----------------------------------------------------
  //CRUD: "ACTUALIZAR"
  updateAppointmentsInCalendar(appointment: Appointment) {
    //  Modifico el evento
    const appointmentModified: Appointment = {
      appointmentPlayers: appointment.appointmentPlayers,
      appointmentStartDate: appointment.appointmentStartDate,
      appointmentStartTime: appointment.appointmentStartTime,
      appointmentEndTime: appointment.appointmentEndTime,
      id: this.selectedAppointmentId
    };

    // llamo al servicio
    this.appointmentService.updateEAppointments(appointmentModified).subscribe(() => {
      alert('Se actualizo el entrenamiento exitosamente');
    })
    // Cierro el modal del formulario de modificacion despues de borrar
    const modal = new bootstrap.Modal(this.exampleModalModification.nativeElement);
    modal.hide();
  }

  //  ----------------------------------------------------Borrar Appointments----------------------------------------------------
  CRUD: "BORRAR"
  deleteAppointmentInCalendar(appointmentId: number): void {
    this.appointmentService.deleteAppointmentsById(appointmentId).subscribe(() => {
      alert('Se elimino el entrenamiento exitosamente');
    });
    // Cierro el modal del formulario de modificacion despues de borrar
    const modal = new bootstrap.Modal(this.exampleModalModification.nativeElement);
    modal.hide();
  }
}