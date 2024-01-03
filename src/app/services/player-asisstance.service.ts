import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry, catchError } from 'rxjs';
import { CommonService } from './common.service';
import { AssistedPlayer } from '../interfaces/assisted-player';

@Injectable({
  providedIn: 'root'
})
export class PlayerAsisstanceService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  // crud: create read update delete

  createPlayerAsisstance(playerAsisstance: AssistedPlayer): Observable<AssistedPlayer> {
    return this.http
      .post<AssistedPlayer>(
        `${this.commonService.apiURL}/asisstance`,
        JSON.stringify(playerAsisstance),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getPlayerAsisstanceById(playerAsisstanceId: number): Observable<AssistedPlayer> {
    return this.http
      .get<AssistedPlayer>(
        `${this.commonService.apiURL}/asisstance/${playerAsisstanceId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  getAllPlayerAsisstances(): Observable<AssistedPlayer[]> {
    return this.http
      .get<AssistedPlayer[]>(
        `${this.commonService.apiURL}/asisstance`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  updatePlayerAsisstances(playerAsisstance: AssistedPlayer) {
    return this.http
      .put<AssistedPlayer>(
        `${this.commonService.apiURL}/asisstance/${playerAsisstance.id}`,
        JSON.stringify(playerAsisstance),
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }

  deletePlayerAsisstancesById(playerAsisstanceId: number) {
    return this.http
      .delete<AssistedPlayer>(
        `${this.commonService.apiURL}/asisstance/${playerAsisstanceId}`,
        this.commonService.httpOptions
      )
      .pipe(retry(1), catchError(this.commonService.handleError));
  }
}
