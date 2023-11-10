import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Event } from '../interfaces/event';
import { Observable, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  // crud: create read update delete

  createEvento(evento: Event): Observable<Event> {
    return this.http
      .post<Event>(
        `${this.commonService.apiURL}/eventos`,
        JSON.stringify(evento),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getEventoById(eventId: number): Observable<Event> {
    return this.http
      .get<Event>(
        `${this.commonService.apiURL}/eventos/${eventId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getAllEvents(): Observable<Event[]> {
    return this.http
      .get<Event[]>(
        `${this.commonService.apiURL}/eventos`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  updateEvento(evento: Event) {
    return this.http
      .put<Event>(
        `${this.commonService.apiURL}/eventos/${evento.id}`,
        JSON.stringify(evento),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  deleteEventoById(eventId: number) {
    return this.http
      .delete<Event>(
        `${this.commonService.apiURL}/eventos/${eventId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }
}
