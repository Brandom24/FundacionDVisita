import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AlertController, NavController } from '@ionic/angular';
import { Usuario } from '../objetosDTO/usuario';
import { LoadingService } from '../services/loading.service';
import { GuardarStorageService } from './guardar-storage.service';
import { URL_TOKEN, URL_SERVICIOS } from '../config/url.services';
import { Router } from '@angular/router';
import { AlertService } from '../herramientas/alert.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  token: string;
  result: boolean;
  message: string;
  typeUser: number;
  dataUser: Usuario = new Usuario();
  boton: string;

  constructor(private http: HttpClient,
              private alertServ: AlertService,
              private navCtrl: NavController,
              private loading: LoadingService,
              private _store: GuardarStorageService,
              private router: Router) {}

  generateToken() {

    this.loading.present('Cargando..');

    const headers = new HttpHeaders({
      'authorization': 'Basic dXNlcmFwcDpwYXNzd29yZA==',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const params = new HttpParams()
    .set('grant_type', 'password')
    .set('username', 'fbe')
    .set('password', 'password');

    return this.http.post(environment.URL_8083 + '/uaa/oauth/token', params, {headers})
              .subscribe( async data => {
                this.token = data['access_token'];
                this._store.setBearerToken(this.token);
                
                this.loading.dismiss();

              }, async error => {
                this.loading.dismiss();
                this.alertServ.alertaAction(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_ERROR, 'rojo', 'Reitentar', ()=> { this.generateToken() });

              });
  }

  verifyUser(user: string, password: string) {

    this.loading.present('Verificando datos..');

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token,
      'Content-Type': 'application/json'
    });

    this.dataUser.setUser(user);
    this.dataUser.setPassword(password);

    return this.http.post(environment.URL_9419 + '/bid/rest/v1/login', JSON.stringify(this.generateJLogin(user, password)), {headers})
              .subscribe( async data => {
                console.log('Login ', data);
                this.loading.dismiss();

                if(data['code'] === -9999) {
                  this.result = data['data']['result'];
                  this.message = data['message'];
                  this.typeUser = data['data']['user'];
                  
                  this._store.guardarStorage('recargar', false);
                  this.navCtrl.navigateRoot('clientes-lista');

                } else {
                  this.alertServ.alertaSimple('¡Usuario no encontrado!', 'Verifique sus datos ingresados por favor', 'Entiendo', 'rojo');
                }

              }, async error => {
                this.loading.dismiss();
                this.alertServ.alertaAction(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_ERROR, 'rojo', 'Reitentar', ()=> { this.verifyUser(user, password) });

                
              });

  }

  generateJLogin(user: string, password: string) {
    const request= {
        data: {
            user: user,
            password: password
        }
      };

    return request;
  }

  check_Storage() {
    if (this._store.address_St) {
      // this.navCtrl.navigateRoot('direcciones');
      this.navCtrl.navigateRoot('menu-principal');
    } else {
      // this.navCtrl.navigateRoot('clientes-lista');
      this.navCtrl.navigateRoot('menu-principal');
    }
  }

  
  finalizar()
  {
    this._store.setCliente(null);
    this._store.setAnversoIdContrato(null);
    this._store.setDatosDomicilio(null);
    this._store.setDatosOCR(null);
    this._store.setImagenDomicilio(null);
    this._store.setIneAnverso(null);
    this._store.setIneReverso(null);
    this._store.setJsonDatosActivity(null);
    this._store.setOperationID(null);
    this._store.setPersonId(null);
    this._store.setReversoIdContrato(null);
    this._store.setTasReferences(null);
    this._store.setTipoFlujo(null);
    this._store.setTipoINE(null);
    this._store.setTipoIdentificacion(null);
    this._store.setResumenDoctos(null);
    this.navCtrl.navigateRoot('menu-principal');    
  }
  

}
