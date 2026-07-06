import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private _http:HttpClient) { }
  
    HttpGet<T>(serviceName: string, fromQuery: any): Observable<T> {
    let httpParams = new HttpParams();
    Object.keys(fromQuery).forEach(key => {
      if (fromQuery[key] !== undefined && fromQuery[key] !== null && fromQuery[key] !== '') {
        httpParams = httpParams.set(key, fromQuery[key].toString());
      }
    });
    return this._http.get<T>(
      environment.URL + serviceName, { params: httpParams }
    ).pipe(
      catchError((error)=>{
        return throwError(() => new Error('Error para obtener datos de los menus.'));
      })
    );
  }

}
