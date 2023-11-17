import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { take } from 'rxjs';
import { Task } from 'src/app/interfaces/task';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'AppComponent',
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
  task = {} as Task;
  //Arreglo de meses
  monthSelect: any = [];
  //Dias del mes seleccionado
  daySelect: string = "";
  //Dia de inicio del mes seleccionado
  dateSelect: any;
  //Variable para poder mostrar el formulario cuando se haga click en un dia especifico
  showForm: boolean = false;
  //
  idOfTask: Task;
  //Arreglo de eventos
  tasks: Task[];

  constructor(private tasksService: TareaService) { }

  ngOnInit(): void {
    this.getDayFromDate(2, 2023);
    this.getAllTaskInCalendar();
  }
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
        //Arreglo de tareas vacio
        tasks: []
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

  //Metodo el cual se llama cuando se hace click en el numero del dia que se requiera y le sumo 1 ya que todo arreglo arranca en 0.
  showTaskForm(day: number) {
    //Dia seleccionado
    this.daySelect = day.toString() + 1;
    // Mostrar el formulario
    this.showForm = true;
  }

  //Creo tarea y lo cargo en el calendario
  // Crud: Crear
  saveTask(task: Task) {
    //Creo nueva tarea para almacenar la informacion de cada tarea creada
    const newTask: Task = {
      time: task.time,
      description: task.description,
      day: this.daySelect
    };
    //Guardo la tarea en el dia seleccionado
    this.monthSelect[this.daySelect].tasks.push(newTask);

    //Codigo para la base de datos json (llamo al tareaService)
    this.tasksService.createTask(newTask).subscribe({
      next: (task) => {
        alert("Se creó la tarea exitosamente");
        this.getAllTaskInCalendar();
      },
    })
  }

  // Crud: leer
  getTasktById(tasktId: number) {
    this.tasksService.getTaskById(tasktId).subscribe((event) => {
      this.task = event;
    });
  }

  // Crud: leer
  getAllTaskInCalendar() {
    this.tasksService.getAllTasks()
      .pipe(take(1))
      .subscribe((tasks) => {
        // por cada tarea, fijate el día y la hora y asignalo al día del mes q corresponda
        //Recorrer cada tarea y mostrar esas tareas en el dia correspondiente
        tasks.forEach((task) => {
          if (task.day === this.daySelect) {
            this.monthSelect[this.daySelect].tasks.day.push(task.day);
          }
        });
      });
  }

  // ---------------------------FALTA--------------------------------------------------------------------------
  //Crud: Actualizar 
  // updateEvents(event: Event) {
  //   this.eventService.updateEvento(event)
  // }
  // ---------------------------FALTA--------------------------------------------------------------------------

  //Crud: Actualizar 
  deleteTaskById(id: number) {
    this.tasksService.deleteTasksById(id).subscribe(() => {
      alert("Se borro la tarea" + id + "exitosamente");
      this.getAllTaskInCalendar();
    })
  }
  // -----------------------------------------------------------------------------------------------------

  //Metodo donde limpio el formulario
  clearForm() {
    //Variable donde obtiene el valor del ultimo id creado
    let currentId = this.task.id;
    //Dejo los elementos del formulario vacios y el id toma el valor del ultimo creado
    this.task = {
      time: "",
      description: "",
      id: currentId,
      day: this.daySelect
    };
    //Oculto el formulario
    this.showForm = false;
  }
}