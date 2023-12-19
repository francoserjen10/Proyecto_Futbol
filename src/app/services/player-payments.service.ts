import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError } from 'rxjs';
import { CommonService } from './common.service';
import { AssistedPlayer } from '../interfaces/assisted-player';

@Injectable({
  providedIn: 'root'
})
export class PlayerPaymentsService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  // crud: create read update delete

  createPlayerPayments(playerPayment: AssistedPlayer): Observable<AssistedPlayer> {
    return this.http
      .post<AssistedPlayer>(
        `${this.commonService.apiURL}/accounting`,
        JSON.stringify(playerPayment),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getPlayerPaymentById(playerPaymentId: number): Observable<AssistedPlayer> {
    return this.http
      .get<AssistedPlayer>(
        `${this.commonService.apiURL}/accounting/${playerPaymentId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getAllPlayerPayments(): Observable<AssistedPlayer[]> {
    return this.http
      .get<AssistedPlayer[]>(
        `${this.commonService.apiURL}/accounting`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  updatePlayerPayments(playerPayment: AssistedPlayer) {
    return this.http
      .put<AssistedPlayer>(
        `${this.commonService.apiURL}/accounting/${playerPayment.id}`,
        JSON.stringify(playerPayment),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  deletePlayerPaymentsById(playerPaymentId: number) {
    return this.http
      .delete<AssistedPlayer>(
        `${this.commonService.apiURL}/accounting/${playerPaymentId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }
}
