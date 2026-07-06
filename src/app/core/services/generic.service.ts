import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class GenericService {
  constructor(
    private _http: HttpClient
  ) {
  }

  HttpGet(serviceName: string, fromQuery: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(fromQuery).forEach(key => {
      if (fromQuery[key] !== undefined && fromQuery[key] !== null && fromQuery[key] !== '') {
        httpParams = httpParams.set(key, fromQuery[key].toString());
      }
    });
    return this._http.get<any>(`${environment.URL}${serviceName}`, { params: httpParams });
  }


  HttpPost(url: string, fromQuery: any, fromBody: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(fromQuery).forEach(key => {
      if (fromQuery[key] !== undefined && fromQuery[key] !== null && fromQuery[key] !== '') {
        httpParams = httpParams.set(key, fromQuery[key].toString());
      }
    });
    return this._http.post<any>(

      environment.URL + url, fromBody, { params: httpParams }
    );
  }

  HttpPut(url: string, fromQuery: any, fromBody: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(fromQuery).forEach(key => {
      if (fromQuery[key] !== undefined && fromQuery[key] !== null && fromQuery[key] !== '') {
        httpParams = httpParams.set(key, fromQuery[key].toString());
      }
    });
    return this._http.put<any>(
      environment.URL + url, fromBody, { params: httpParams }
    );
  }

  HttpDelete(url: string, fromQuery: any, fromBody: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(fromQuery).forEach(key => {
      if (fromQuery[key] !== undefined && fromQuery[key] !== null && fromQuery[key] !== '') {
        httpParams = httpParams.set(key, fromQuery[key].toString());
      }
    });
    return this._http.delete<any>(
      environment.URL + url, { body: fromBody, params: httpParams }
    );
  }

}


