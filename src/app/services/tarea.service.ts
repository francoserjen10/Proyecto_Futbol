import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Task } from '../interfaces/task';
import { Observable, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  // crud: create read update delete

  createTask(tarea: Task): Observable<Task> {
    return this.http
      .post<Task>(
        `${this.commonService.apiURL}/tareas`,
        JSON.stringify(tarea),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getTaskById(taskId: number): Observable<Task> {
    return this.http
      .get<Task>(
        `${this.commonService.apiURL}/tareas/${taskId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getAllTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(
        `${this.commonService.apiURL}/tareas`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  updateETasks(tarea: Task) {
    return this.http
      .put<Task>(
        `${this.commonService.apiURL}/tareas/${tarea.id}`,
        JSON.stringify(tarea),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  deleteTasksById(taskId: number) {
    return this.http
      .delete<Task>(
        `${this.commonService.apiURL}/tareas/${taskId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }
}