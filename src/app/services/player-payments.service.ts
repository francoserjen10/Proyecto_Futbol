import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError } from 'rxjs';
import { CommonService } from './common.service';
import { PlayerPayment } from '../interfaces/player-payment';

@Injectable({
  providedIn: 'root'
})
export class PlayerPaymentsService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  // crud: create read update delete

  createPlayerPayments(playerPayment: PlayerPayment): Observable<PlayerPayment> {
    return this.http
      .post<PlayerPayment>(
        `${this.commonService.apiURL}/payments`,
        JSON.stringify(playerPayment),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getPlayerPaymentById(playerPaymentId: number): Observable<PlayerPayment> {
    return this.http
      .get<PlayerPayment>(
        `${this.commonService.apiURL}/payments/${playerPaymentId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getAllPlayerPayments(): Observable<PlayerPayment[]> {
    return this.http
      .get<PlayerPayment[]>(
        `${this.commonService.apiURL}/payments`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  updatePlayerPayments(playerPayment: PlayerPayment) {
    return this.http
      .put<PlayerPayment>(
        `${this.commonService.apiURL}/payments/${playerPayment.id}`,
        JSON.stringify(playerPayment),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  deletePlayerPaymentsById(playerPaymentId: number) {
    return this.http
      .delete<PlayerPayment>(
        `${this.commonService.apiURL}/payments/${playerPaymentId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }
}
