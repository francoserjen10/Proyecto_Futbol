import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Appointment  } from 'src/app/interfaces/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
     plugins: [dayGridPlugin],
     //Muestro la semana completa o muestro 5 dias
     weekends: false,
  };

  constructor(private appointmentService: AppointmentService) { }

  ngOninit(): void {
  }

  //Metodo donde cambia el valor de weekends para mostrar o no la semana completa
  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  //Creo tarea y actualizo el calendario
  // Crud: Crear
  createAppointment (appointment : Appointment): void {
    // #TODO (opcional): Se puede agregar una validación para saber si el formulario que envió está ok
    //Llamo al servicio
    this.appointmentService.createAppointment(appointment).subscribe({
      next(appointment) {
        console.log(`Tarea creada exitosamente ${appointment}`);
        alert(`Se creo la tares exitosamente ${appointment.description}`);
        // #TODO (opcional): Si salió todo ok, se puede "limpiar" el formulario
      }
    });
    console.log("Quiero ver si entrar las tareas");

    this.getAllAppointmentInCalendar();
  }

    // Obtener todos los eventos
    getAllAppointmentInCalendar(): void {
      this.appointmentService
        .getAllAppointments()
        .subscribe((appointments) => {
          appointments.forEach((appointment) => {
            console.log("Obtener tareas", appointment);

            // #TODO: Al listado de días que tengas, agregale los eventos que estás recibiendo acá
          })
        })
    }

    // #TODO: Update

    // #TODO: Delete
}