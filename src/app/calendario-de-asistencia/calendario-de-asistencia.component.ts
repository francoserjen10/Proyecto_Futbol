import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-calendario-de-asistencia',
  templateUrl: './calendario-de-asistencia.component.html',
  styleUrls: ['./calendario-de-asistencia.component.css']
})
export class CalendarioDeAsistenciaComponent implements OnInit {
  events: any[];
  options: any;

  constructor() { }

  ngOnInit() {

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: new Date(),
      locale: esLocale,
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: false,
    }

    this.events = [
      {
        title: "Evento 1",
        start: new Date(),
        description: "Evento 1"
      },
      {
        title: "Evento 2",
        start: new Date(new Date().getTime() + 86400000),
        description: "Evento 2"
      },
      {
        title: "Evento 3",
        start: new Date(new Date().getTime() + (86400000 * 2)),
        end: new Date(new Date().getTime() + (86400000 * 3)),
        description: "Evento 3"
      }
    ];
  }
}
