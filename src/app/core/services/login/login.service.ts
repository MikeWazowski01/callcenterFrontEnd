import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class LoginService {
  jwtHelper = new JwtHelperService();
  constructor(
    private _http: HttpClient
  ) {
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

}
