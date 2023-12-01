import { Component, ViewChild } from '@angular/core';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment } from 'src/app/interfaces/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {

  @ViewChild('exampleModalModification') exampleModalModification: ElementRef;

  //Inicializacion de la interfas
  appointment: Appointment = {
    appointmentPlayers: '',
    appointmentStartDate: '',
    appointmentStartTime: '',
    appointmentEndTime: ''
  };

  //Almaceno el id del evento seleccionado
  selectedAppointmentId: number;

  handleEventClick = (info: any) => {
    //Le asigno el id del appointment seleccionado
    this.selectedAppointmentId = info.event.id;
    //Le asigno el appointment seleccionado
    const appointment = info.event;
    //Muestro la informacion del appointment seleccionado en el formulario
    this.appointment.appointmentPlayers = appointment.title;
    // toISOString() = Se usa para formatear un objeto de fecha en una cadena de texto en formato de fecha ISO
    // .split('T')[0] = Y aca se quiere extraer solo la parte de la fecha y asi puede aparecer en el formulario
    this.appointment.appointmentStartDate = appointment.start.toISOString().split('T')[0];
    // [1] = accede al segundo elemento del arreglo que es la parte de la hora
    // .substring(0, 5) = toma los primeros 5 caracteres de la cadena de la hora que en el formato ISO, representa las dos primeras cifras del valor de la hora
    this.appointment.appointmentStartTime = appointment.start.toISOString().split('T')[1].substring(0, 5);
    this.appointment.appointmentEndTime = appointment.end.toISOString().split('T')[1].substring(0, 5);

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

  constructor(private appointmentService: AppointmentService) { }

  // En el ngOnInit, al recargar la pagina se ejecutara primero
  ngOnInit(): void {
    this.getAllAppointmentInCalendar();
  }

  // CRUD: "LEER"
  getAllAppointmentInCalendar(): void {
    this.appointmentService.getAllAppointments().subscribe((appointments: Appointment[]) => {
      const events: EventSourceInput = appointments.map(appointment => ({
        //Se le pasa los datos del nuevo appointment a la informacion del calendario
        title: appointment.appointmentPlayers,
        start: appointment.appointmentStartDate + ' ' + appointment.appointmentStartTime,
        end: appointment.appointmentStartDate + ' ' + appointment.appointmentEndTime,
        //Al id se lo transforma en string, ya que el tipo que acepta los eventos en esta libreria (EventSourceInput), acepta solamente string
        id: appointment.id.toString()
      }));
      // Actualiza los appointments del calendario
      this.calendarOptions.events = events;
    });
  }

  // //Creo tarea y actualizo el calendario
  // // CRUD: CREAR
  createAppointment(appointment: Appointment): void {
    //Tengo un appointment nuevo
    const newAppointment: Appointment = {
      appointmentPlayers: appointment.appointmentPlayers,
      appointmentStartDate: appointment.appointmentStartDate,
      appointmentStartTime: appointment.appointmentStartTime,
      appointmentEndTime: appointment.appointmentEndTime
    };
    //   // #TODO (opcional): Se puede agregar una validación para saber si el formulario que envió está ok
    //   //Llamo al servicio
    this.appointmentService.createAppointment(appointment).subscribe({
      next(appointment) {
        alert('Se creó el Entrenamiento exitosamente');
      },
      error(err) {
        console.error(err);
        alert('Ocurrió un error al intentar crear el jugEntrenamientoador');
      },
    });
    //Actualizo la lista de todos los appointments creados
    this.getAllAppointmentInCalendar();
    //Cierro el modal del formulario de modificacion despues de borrar
    const modal = new bootstrap.Modal(this.exampleModalModification.nativeElement);
    modal.hide();
  }

  //CRUD: "ACTUALIZAR"
  updateAppointmentsInCalendar(appointment: Appointment) {
    //Modifico el evento
    const appointmentModified: Appointment = {
      appointmentPlayers: appointment.appointmentPlayers,
      appointmentStartDate: appointment.appointmentStartDate,
      appointmentStartTime: appointment.appointmentStartTime,
      appointmentEndTime: appointment.appointmentEndTime,
      id: this.selectedAppointmentId
    };

    //llamo al servicio
    this.appointmentService.updateEAppointments(appointmentModified).subscribe(() => {
      alert('Se actualizo el entrenamiento exitosamente');
      //  Actualizo nuevamente
      this.getAllAppointmentInCalendar();
      //  Limpio el formulario
      this.cleanForm();
    })
    //Cierro el modal del formulario de modificacion despues de borrar
    const modal = new bootstrap.Modal(this.exampleModalModification.nativeElement);
    modal.hide();
  }

  // //CRUD: "BORRAR"
  deleteAppointmentInCalendar(appointmentId: number): void {
    this.appointmentService.deleteAppointmentsById(appointmentId).subscribe(() => {
      alert('Se elimino el entrenamiento exitosamente');
      // Actualizo la lista de todos los appointments nuevamente
      this.getAllAppointmentInCalendar();
    });
    //Cierro el modal del formulario de modificacion despues de borrar
    const modal = new bootstrap.Modal(this.exampleModalModification.nativeElement);
    modal.hide();
  }

  //Limpia el formulario
  cleanForm() {
    this.appointment = {
      appointmentPlayers: '',
      appointmentStartDate: '',
      appointmentStartTime: '',
      appointmentEndTime: ''
    }
  }

  createAppointmentAndCleanForm(appointment: Appointment) {
    this.createAppointment(appointment);
    this.cleanForm();
  }

  deleteAppointmentAndCleanForm(appointmentId: number) {
    this.deleteAppointmentInCalendar(appointmentId);
    this.cleanForm();
  }
}