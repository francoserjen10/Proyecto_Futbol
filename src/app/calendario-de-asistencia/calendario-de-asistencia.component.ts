import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

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

  monthSelect: any[] = [];
  dateSelect: any;

  constructor() { }

  ngOnInit(): void {
    this.getDayFromDate(2, 2023);
  }

  //"Obtener el dia desde la fecha". Es el metodo principal del calendario
  getDayFromDate(month: any, year: any) {
    //Constante donde llamo a moment y a utc (Sirve para declarar un horario estandar)
    //Comienzo del mes
    const startDate = moment.utc(`${year}-${month}-01`, 'YYYY-MM-DD');

    //Constante tambien de tipo fecha que funcione para saber cuando termina el mes. Eso se hace con .endOf(`month`). Y utilizamos clone para tener una fecha que no se itere, ya que "moment" suele iterar las fechas cuando se hace uso de sus metodos.
    //Final del mes
    const endDate = startDate.clone().endOf("month");
    this.dateSelect = startDate;

    //.diff es para que nos trae (en dias, horas, mitutos, dependiendo del argumento que le pasemos) los dias que existen entre la fecha de inicio (startDate) y la fecha final (endDate).
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
        indexWeek: dayObject.isoWeekday()
      };
    });
    //Agregamos todo el arreglo de dias "arrayDays"a "monthSelect"
    this.monthSelect = arrayDays;
  }

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
}
