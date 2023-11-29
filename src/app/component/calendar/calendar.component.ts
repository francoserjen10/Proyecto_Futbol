import { Component } from '@angular/core';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment } from 'src/app/interfaces/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {

  //Inicializacion de la interfas
  appointment: Appointment = {
    appointmentPlayers: '',
    appointmentStartDate: '',
    appointmentStartTime: '',
    appointmentEndTime: ''
  };

  //Metodo para borrar de el calendario y de la base de datos local el appointment seleccionado
  handleEventClick = (info: any) => {
    //Le asigno el id del evento seleccionado
    const appointmentId = info.event.id;
    //Elimino el appointment
    this.deleteAppointmentInCalendar(appointmentId);
  }

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

    // ----------------PARA MOSTRAR PROPIEDADES DE LOS APPOINTMENTS-----------------
    // Se declara en true para que aparezca el horario de finalizacion de los appointments
    forceEventDuration: true,

    // ----------------EDICION DE APPOINTMENTS-----------------
    //Para arrastrar o cambiar de tamaño los appointments
    editable: true,
    //Permite editar la duracion de los appointments arrastrandolos
    eventDurationEditable: true,
    //Permite editar la hora de inicio de los appointments arrastrandolos
    eventStartEditable: true,
    //Se maneja el evento click de los eventos (Se ejecuta el metodo this.handleEventClick)
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
      const meets: EventSourceInput = appointments.map(appointment => ({
        //Se le pasa los datos del nuevo appointment a la informacion del calendario
        title: appointment.appointmentPlayers,
        start: appointment.appointmentStartDate + ' ' + appointment.appointmentStartTime,
        end: appointment.appointmentStartDate + ' ' + appointment.appointmentEndTime,
        //Al id se lo transforma en string, ya que el tipo que acepta los eventos en esta libreria (EventSourceInput), acepta solamente string
        id: appointment.id.toString()
      }));
      // Actualiza los appointments del calendario
      this.calendarOptions.events = meets;
    });
  }

  //Creo tarea y actualizo el calendario
  // CRUD: CREAR
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
        alert(`Creado exitosamente`);
      },
      error(err) {
        console.error(err);
        alert('Ocurrió un error al intentar crear el appointment');
      },
    });
    //Actualizo la lista de todos los appointments creados
    this.getAllAppointmentInCalendar();
  }

  //CRUD: "BORRAR"
  deleteAppointmentInCalendar(appointmentId: number): void {
    this.appointmentService.deleteAppointmentsById(appointmentId).subscribe(() => {
      alert('Se elimino el entrenamiento exitosamente');
      // Actualizo la lista de todos los appointments nuevamente
      this.getAllAppointmentInCalendar();
    });
  }

  //Limpio formulario
  cleanForm() {
    this.appointment = {
      appointmentPlayers: '',
      appointmentStartDate: '',
      appointmentStartTime: '',
      appointmentEndTime: ''
    }
  }

  //Metodo donde creo y limpio el formulario (Hecho así, para mantener metodos lo mas individual posible)
  createAppointmentAndCleanForm(appointment: Appointment) {
    this.createAppointment(appointment);
    this.cleanForm();
  }
}