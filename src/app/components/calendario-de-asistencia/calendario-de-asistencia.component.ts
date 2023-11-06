import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Event } from '../../interfaces/event';

@Component({
  selector: 'app-calendario-de-asistencia',
  templateUrl: './calendario-de-asistencia.component.html',
  styleUrls: ['./calendario-de-asistencia.component.css']
})
export class CalendarioDeAsistenciaComponent implements OnInit {

  //Arreglo con todos los dias de la semana
  week: any = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo"
  ];
  //Inicializo la interface
  event: Event = {
    time: "",
    description: "",
    id: 1
  };
  //Dia seleccionado
  daySelect: number = 0;
  //Arreglo de meses
  monthSelect: any = [];
  //Dia de inicio del mes seleccionado
  dateSelect: any;
  //Variable para poder mostrar el formulario cuando se haga click en un dia especifico
  showForm: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.getDayFromDate(2, 2023);
  }
  // -----------------------------------------------------------------------------------------------------
  //Obtener el dia desde la fecha". Es el metodo principal del calendario
  getDayFromDate(month: any, year: any) {
    //Constante donde llamo a moment y a utc (Sirve para declarar un horario estandar)
    //Comienzo del mes
    const startDate = moment.utc(`${year}-${month}-01`, 'YYYY-MM-DD');
    //Constante tambien de tipo fecha que funcione para saber cuando termina el mes. Eso se hace con .endOf(`month`). Y utilizamos clone para tener una fecha que no se itere, ya que "moment" suele iterar las fechas cuando se hace uso de sus metodos.
    //Final del mes
    const endDate = startDate.clone().endOf("month");
    this.dateSelect = startDate;
    //.diff es para que nos traiga (en dias, horas, mitutos, dependiendo del argumento que le pasemos) los dias que existen entre la fecha de inicio (startDate) y la fecha final (endDate).
    //Le pasamos el valor booleano "true", para que nos de un valor decimal mas exacto.
    const diffDays = endDate.diff(startDate, 'days', true);
    //Constante donde redondea el numero traido desde "diffDays"
    const numberDays = Math.round(diffDays);
    // Creamos constante de arreglo de dias (se almacenan los dias)
    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      //Le asignamos a "a" un numero entero y como es un arreglo de dias y los arreglos comienzan con 0, le sumamos 1 para que empiece de 1
      a = parseInt(a) + 1;
      //Esta constante es un objeto de fecha, y ya teniendo los años, meses y dias, se lo paso a moment y se va a encargar de retornarnos un objeto tipo fecha
      const dayObject = moment(`${year}-${month}-${a}`, 'YYYY-MM-DD');
      return {
        //name nos va a dar el formato del dia
        name: dayObject.format("dddd"),
        //El valor de a (los dias)
        value: a,
        //El isoWeekday nos trae el indice que representa el dia "a" en la semana
        indexWeek: dayObject.isoWeekday(),
        //Arreglo de evento vacio
        events: []
      };
    });
    //Agregamos todo el arreglo de dias "arrayDays"a "monthSelect"
    this.monthSelect = arrayDays;
  }
  //Metodo que le da funcionalidad a los botones donde selecciono los meses
  changeMonth(flag: number) {
    if (flag < 0) {
      //constante donde substraemos un mes (quitamos un mes para darle funcionalidad al boton)
      const prevDate = this.dateSelect.clone().subtract(1, "month");
      //llamo al metodo "getDayFromDate", para darle la informacion de la constante "prevDate" con el formato de mes y año
      this.getDayFromDate(prevDate.format("MM"), prevDate.format("YYYY"));
    } else {
      //constante donde agregamos un mes (sumamos un mes para darle funcionalidad al boton)
      const nextDate = this.dateSelect.clone().add(1, "month");
      //llamo al metodo "getDayFromDate", para darle la informacion de la constante "nextDate" con el formato de mes y año
      this.getDayFromDate(nextDate.format("MM"), nextDate.format("YYYY"));
    };
  }
  //Metodo el cual se llama cuando se hace click en el numero del dia que se requiera. 
  showEventForm(dayNumber: number) {
    this.daySelect = dayNumber;
    // Mostrar el formulario
    this.showForm = true;
  }
  //Creo evento y lo cargo en el calendario
  saveEvent(event: Event) {
    //Aumento el id a cada evento creado
    this.event.id++;
    //Creo nuevo evento para almacenar la informacion de cada evento creado
    const newEvent: Event = {
      time: event.time,
      description: event.description,
      id: this.event.id
    };
    //Guardo el evento en el dia seleccionado
    this.monthSelect[this.daySelect].events.push(newEvent);
  }
  //Metodo que se llama cuando se hace click en el boton borrar dentro de los eventos y elimina un evento con respecto a su id
  deleteEvent(id: number) {
    //Almaceno todos los eventos en el dia seleccionado
    const getEvent = this.monthSelect[this.daySelect].events;
    //filtro todos los eventos, almacenando en la constante idDelete a todos los eventos cuyo id sean distinto al id que se ingresa por parametro, en caso contrario, ese evento no se almacena en la constante
    const idDelete = getEvent.filter((event: { id: number }) => event.id !== id);
    //Se actualiza la lista de eventos, eliminando asi a los que no cumplieron con la condicion
    this.monthSelect[this.daySelect].events = idDelete;
  }
  //Metodo donde limpio el formulario
  clearForm() {
    //Variable donde obtiene el valor del ultimo id creado
    let currentId = this.event.id;
    //Dejo los elementos del formulario vacios y el id toma el valor del ultimo creado
    this.event = {
      time: "",
      description: "",
      id: currentId
    };
    //Oculto el formulario
    this.showForm = false;
  }
}