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
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {

  @ViewChild('exampleModalModification') exampleModalModification: ElementRef;

  newAppointmentForm: FormGroup;
  updateAppointmentForm: FormGroup;
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
    // --------------------------------- Appointment / id ---------------------------------
    const appointment = info.event;
    this.selectedAppointmentId = info.event.id;

    const appointmentsAndPlayers = this.combinedAppointmentsWithPlayers.find(ap => ap.id.toString() === this.selectedAppointmentId.toString());
    if (appointmentsAndPlayers) {
      const playersAttendancesAndPayments = appointmentsAndPlayers.appointmentPlayers.map(player => this.formBuilder.group({
        attended: player.attended,
        moneyPaid: player.moneyPaid,
        playerId: player.playerId
      }));
      this.updateAppointmentForm.setControl("updateAttendanceAndPayments", this.formBuilder.array(playersAttendancesAndPayments || []))
    };

    // --------------------------------- Appointment Date/Hour ---------------------------------
    this.updateAppointmentForm.patchValue({
      appointmentStartDate: appointment.start.toISOString().split('T')[0],
      // toISOString() = Se usa para formatear un objeto de fecha en una cadena de texto en formato de fecha ISO
      // .split('T')[0] = Y aca se quiere extraer solo la parte de la fecha y asi puede aparecer en el formulario
      appointmentStartTime: appointment.start.toISOString().split('T')[1].substring(0, 5),
      appointmentEndTime: appointment.end.toISOString().split('T')[1].substring(0, 5),
      // [1] = accede al segundo elemento del arreglo que es la parte de la hora
      // .substring(0, 5) = toma los primeros 5 caracteres de la cadena de la hora que en el formato ISO, representa las dos primeras cifras del valor de la hora
      updateAttendanceAndPayments: appointmentsAndPlayers.appointmentPlayers
    });
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
    public formBuilder: FormBuilder
  ) {
    //Nuevo formulario de creación
    this.newAppointmentForm = this.formBuilder.group({
      appointmentStartDate: [''],
      appointmentStartTime: [''],
      appointmentEndTime: [''],
      attendanceAndPayments: this.formBuilder.array([])
    });
    //Nuevo formulario de modificación
    this.updateAppointmentForm = this.formBuilder.group({
      appointmentStartDate: [''],
      appointmentStartTime: [''],
      appointmentEndTime: [''],
      updateAttendanceAndPayments: this.formBuilder.array([])
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
          appointmentPlayers: Array.isArray(appointment.appointmentPlayers) ? appointment.appointmentPlayers.map((playerIdOfAppointment) => {
            const playerIdComparison = this.allPlayers.filter((player) => {
              return player.id === playerIdOfAppointment.playerId;
            })
            return {
              ...playerIdOfAppointment
            };
          })
            //Si no es un arreglo, se devuelve el mismo valor sin hacer ninguna operacion
            : appointment.appointmentPlayers
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
          const appointmentPlayersArray = Array.isArray(appointment.appointmentPlayers) ? appointment.appointmentPlayers
            : [];
          //Mapeo los jugadores
          const playerProperty = appointmentPlayersArray.map((playerIdOfAppointmentPlayer) => {
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

  // ---------------------------------------------------- Formulario de creación ----------------------------------------------------
  //Obtengo el formulario de modificación de asistencias y pagos de los jugadores 
  getAttendancesAndPayments(): FormArray {
    return this.newAppointmentForm.get('attendanceAndPayments') as FormArray;
  }

  // Inserto las propiedades de appointmentPlayers a la parte del formulario de modificación
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

  // ---------------------------------------------------- Formulario de modificación ----------------------------------------------------
  //Obtengo el formulario de modificación de asistencias y pagos de los jugadores 
  getUpdateAttendancesAndPayments(): FormArray {
    return this.updateAppointmentForm.get('updateAttendanceAndPayments') as FormArray;
  }

  // Inserto las propiedades de appointmentPlayers a la parte del formulario de modificación
  addUpdateAttendancesAndPayments() {
    this.getUpdateAttendancesAndPayments().push(this.newUpdateAttendanceAndPayment());
  }

  //Inicializo las propiedades de appointmentPlayers
  newUpdateAttendanceAndPayment() {
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
    this.clearForm();
  }

  // ---------------------------------------------------- Actualización de Appointments ----------------------------------------------------
  //CRUD: "ACTUALIZAR"
  updateAppointmentsInCalendar(appointment: Appointment) {
    //Verifico updateAppointmentForm
    if (this.updateAppointmentForm?.valid) {
      //  Modifico el evento
      const appointmentModified: Appointment = {
        appointmentPlayers: this.updateAppointmentForm.get('updateAttendanceAndPayments').value.map(updatePlayerData => ({
          playerId: parseInt(updatePlayerData.playerId),
          moneyPaid: updatePlayerData.moneyPaid,
          attended: updatePlayerData.attended
        })),
        appointmentStartDate: this.updateAppointmentForm.get('appointmentStartDate').value,
        appointmentStartTime: this.updateAppointmentForm.get('appointmentStartTime').value,
        appointmentEndTime: this.updateAppointmentForm.get('appointmentEndTime').value,
        id: this.selectedAppointmentId
      };

      // llamo al servicio
      this.appointmentService.updateEAppointments(appointmentModified).subscribe((value) => {
        alert('Se actualizo el entrenamiento exitosamente');
      });
      this.appointment = {} as Appointment;
    }
    //Obtengo los eventos nuevamente
    this.getAppointmentsAndPlayers();

    // #TODO: Hacer que se cierre el modal despues de actualizar

    // Limpio el formulario
    this.updateAppointmentForm.reset();
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
    // #TODO: Renderizar la pagina para que se se eliminen rapidamente los appointments
  }

  //  ----------------------------------------------------Limpiar Formulario de creación----------------------------------------------------
  clearForm() {
    //Limpio el formulario
    this.newAppointmentForm.reset();
    this.newAppointmentForm.setControl("attendanceAndPayments", this.formBuilder.array([]));
  }
}