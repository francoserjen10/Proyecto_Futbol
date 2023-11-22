import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Appointment } from '../interfaces/appointment';
import { Observable, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  // crud: create read update delete

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http
      .post<Appointment>(
        `${this.commonService.apiURL}/appointment`,
        JSON.stringify(appointment),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getAppointmentById(appointmentId: number): Observable<Appointment> {
    return this.http
      .get<Appointment>(
        `${this.commonService.apiURL}/appointment/${appointmentId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(
        `${this.commonService.apiURL}/appointment`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  updateEAppointments(appointment: Appointment) {
    return this.http
      .put<Appointment>(
        `${this.commonService.apiURL}/appointment/${appointment.id}`,
        JSON.stringify(appointment),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  deleteAppointmentsById(appointmentId: number) {
    return this.http
      .delete<Appointment>(
        `${this.commonService.apiURL}/appointment/${appointmentId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }
}