import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Appointment } from 'src/app/interfaces/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  calendarOptions: CalendarOptions = {
    //Plugins para los botones
    plugins:
      [dayGridPlugin, timeGridPlugin, listPlugin],
    //Header del calendario, donde tengo los botones para correr el mes, acceder al dia de hoy y seleccionar si queres que el calendario te muestre el mes, la semana, el dia y la lista de eventos.
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth, timeGridWeek, timeGridDay, listWeek'
    },
    //Se muestra el mes completo por defecto
    initialView: 'dayGridMonth',
    //Muestro la semana completa o muestro 5 dias
    weekends: true,


  }


  constructor(private appointmentServices: AppointmentService) {

  }

 



  // //Creo tarea y actualizo el calendario
  // // Crud: Crear
  // createAppointment(appointment: Appointment): void {
  //   // #TODO (opcional): Se puede agregar una validación para saber si el formulario que envió está ok
  //   //Llamo al servicio
  //   this.appointmentService.createAppointment(appointment).subscribe({
  //     next(appointment) {
  //       console.log(`Tarea creada exitosamente ${appointment}`);
  //       alert(`Se creo la tares exitosamente ${appointment.description}`);
  //       // #TODO (opcional): Si salió todo ok, se puede "limpiar" el formulario
  //     }
  //   });
  //   console.log("Quiero ver si entrar las tareas");

  //   this.getAllAppointmentInCalendar();
  // }

  // // Obtener todos los eventos
  // getAllAppointmentInCalendar(): void {
  //   this.appointmentService
  //     .getAllAppointments()
  //     .subscribe((appointments: any) => {
  //       // appointments.forEach((appointment) => {
  //       //   console.log("Obtener tareas", appointment);

  //       //   // #TODO: Al listado de días que tengas, agregale los eventos que estás recibiendo acá
  //       // })
  //     })
  // }

  // #TODO: Update

  // #TODO: Delete
}