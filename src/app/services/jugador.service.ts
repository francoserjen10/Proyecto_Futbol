import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { retry, catchError } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Jugador } from '../interfaces/Jugador';

@Injectable({
  providedIn: 'root',
})
export class JugadorService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  // crud: create read update delete

  createJugador(jugador: Jugador): Observable<Jugador> {
    return this.http
      .post<Jugador>(
        `${this.commonService.apiURL}/jugadores`,
        JSON.stringify(jugador),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getJugadorById(jugadorId: number): Observable<Jugador> {
    return this.http
      .get<Jugador>(
        `${this.commonService.apiURL}/jugadores/${jugadorId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getAllJugadores(): Observable<Jugador[]> {
    return this.http
      .get<Jugador[]>(
        `${this.commonService.apiURL}/jugadores`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  updateJugador(jugador: Jugador) {
    return this.http
      .put<Jugador>(
        `${this.commonService.apiURL}/jugadores/${jugador.id}`,
        JSON.stringify(jugador),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  deleteJugadorById(jugadorId: number) {
    return this.http
      .delete<Jugador>(
        `${this.commonService.apiURL}/jugadores/${jugadorId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }
}
