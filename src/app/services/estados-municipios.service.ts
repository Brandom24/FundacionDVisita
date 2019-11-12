import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { URL_SERV_PUERTO } from '../config/url.services';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadosMunicipiosService {

  locality: any[];
  url = URL_SERV_PUERTO + '/catalogues/selector';

  constructor(private http: HttpClient,
              private loginSrv: LoginService) { }


  generateState() {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.loginSrv.token
    });

    return this.http.get(environment.URL_9415 + '/bid/rest/v1/catalogues/selector?value=state', {headers});
  }

  generateMuni(idState: number) {
    
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.loginSrv.token
    });

    return this.http.get(environment.URL_9415 + '/bid/rest/v1/catalogues/selector?value=city&filter=' + idState, {headers});
  }
}
