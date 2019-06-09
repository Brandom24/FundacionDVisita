import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AlertController, NavController } from '@ionic/angular';
import { Usuario } from '../objetosDTO/usuario';
import { LoadingService } from '../services/loading.service';
import { GuardarStorageService } from './guardar-storage.service';
import { URL_TOKEN, URL_SERVICIOS } from '../config/url.services';

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
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private loading: LoadingService,
              private _store: GuardarStorageService) {
                this._store.cargarStorage();
              }

  generateToken() {

    this.loading.present('Conectando..');

    const headers = new HttpHeaders({
      'authorization': 'Basic dXNlcmFwcDpwYXNzd29yZA==',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const params = new HttpParams()
    .set('grant_type', 'password')
    .set('username', 'frd')
    .set('password', 'password');

    return this.http.post(URL_TOKEN + '/uaa/oauth/token', params, {headers})
              .subscribe( async data => {
                this.token = data['access_token'];
                this._store.setBearerToken(this.token);
                
                this.loading.dismiss();

              }, async error => {
                this.loading.dismiss();

                const alert = await this.alertCtrl.create({
                  backdropDismiss: false,
                  header: 'Ups!',
                  subHeader: 'No se pudo conectar intente nuevamente',
                  buttons: [{
                    text: 'Reintentar',
                    role: 'reintentar',
                    cssClass: 'secondary',
                    handler: () => {
                      this.generateToken();
                    }
                  },
                ]
                });
                await alert.present();
              });
  }

  verifyUser(user: string, password: string) {

    this.loading.present('Verificando datos..');

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });

    this.dataUser.setUser(user);
    this.dataUser.setPassword(password);

    const formData = new FormData();
    formData.append('json', JSON.stringify(this.dataUser));

    return this.http.post(URL_SERVICIOS + '/auth/login', formData, {headers})
              .subscribe( async data => {
                // console.log('Permitido', data);
                this.result = data['resultOK'];
                this.message = data['message'];
                this.typeUser = data['user'];
                this.loading.dismiss();
                // this.check_Storage();
                if(this.result) {
                this.navCtrl.navigateRoot('clientes-lista');

                } else {
                  const alert = await this.alertCtrl.create({
                    mode: 'ios',
                    backdropDismiss: false,
                    header: 'Error al intentar iniciar sesión',
                    subHeader: this.message,
                    buttons: [{
                      text: 'Cambiar datos',
                      role: 'reintentar',
                      cssClass: 'secondary',
                      handler: () => {
                        // accion del boton
                      }
                    },
                  ]
                  });
                  await alert.present();
                }

              }, async error => {

                this.loading.dismiss();

                const alert = await this.alertCtrl.create({
                  mode: 'ios',
                  header: '¡Ups!',
                  message: 'Ocurrio un problema en la conexion ¿Reitentar?',
                  buttons: [
                    {
                      text: 'No',
                      role: 'volver',
                      cssClass: 'secondary',
                      handler: (blah) => {
                        // Accion del boton
                      }
                    }, {
                      text: 'Si',
                      handler: () => {
                        this.verifyUser(this.dataUser.getUser(), this.dataUser.getPassword())
                      }
                    }
                  ]
                });
                await alert.present();
              });

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
