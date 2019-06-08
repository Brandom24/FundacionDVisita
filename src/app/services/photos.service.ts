import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginService } from '../services/login.service';
import { PhotosDTO } from '../objetosDTO/photosDTO';
import { AlertController, NavController } from '@ionic/angular';
import { GuardarStorageService } from './guardar-storage.service';
import { RazonesService } from './razones.service';
import { LoadingService } from './loading.service';
import { URL_SERVICIOS } from '../config/url.services';
import { DataClientesService } from './data-clientes.service';

@Injectable({
  providedIn: 'root'
})

export class PhotosService {

  dataP: PhotosDTO = new PhotosDTO();
  result: boolean;
  message: string;
  resultR: string;
  messageR: string;
  productoId: number;
  activityStatus: string;
  dataR: string;
  secuence: number;
  workflowId: number;
  personId: number;
  timeZoneId: number;
  userId: number;

  private photosServ: any;
  private fechaServ: any;
  private razonServ: any;
  private actividadServ: any;
  private defineServ: any;
  private direccionServ: any;

  constructor(private http: HttpClient,
              private login: LoginService,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private _store: GuardarStorageService,
              private razones: RazonesService,
              private loading: LoadingService,
              private dataClient: DataClientesService) {}

  public getPhotosServ(): any {
      return this.photosServ;
  }

  public setPhotosServ(photosServ: any): void {
      this.photosServ = photosServ;
  }

  public getFechaServ(): any {
      return this.fechaServ;
  }

  public setFechaServ(fechaServ: any): void {
      this.fechaServ = fechaServ;
  }

  public getRazonServ(): any {
    return this.razonServ;
}

public setRazonServ(razonServ: any): void {
    this.razonServ = razonServ;
}

public getActividadServ(): any {
    return this.actividadServ;
}

public setActividadServ(actividadServ: any): void {
    this.actividadServ = actividadServ;
}

public getDefineServ(): any {
    return this.defineServ;
}

public setDefineServ(defineServ: any): void {
    this.defineServ = defineServ;
}

public getDireccionServ(): any {
  return this.direccionServ;
}

public setDireccionServ(direccionServ: any): void {
  this.direccionServ = direccionServ;
}


  sendPhotos( photos: any, fecha: any) {

    this.setPhotosServ(photos);
    this.setFechaServ(fecha);

    this.loading.present('Finalizando..');

    const formData = new FormData();
    console.log(photos.size);

    console.log('Operation ID -------' + this.dataClient.operationID.toString());
    if (photos.has(1) && photos.has(2)) {

    this.dataP.setDocCode1('IDOFA');
    this.dataP.setDocCode2('IDOFB');
    this.dataP.setOperID1(this.dataClient.operationID.toString());
    this.dataP.setOperID2(this.dataClient.operationID.toString());
    this.dataP.setActivityStatus1('OK');
    this.dataP.setActivityStatus2('OK');
    this.dataP.setLat(photos.get(3) ? photos.get(3) : 19 );
    this.dataP.setLng(photos.get(4) ? photos.get(4) : -90);
    formData.append('jsonRequest', JSON.stringify(this.dataP));
    formData.append('file1', photos.get('blobP'));
    formData.append('dataFile1', JSON.stringify(this.generateJson('Vivienda_Exterior', fecha)));
    formData.append('file2', photos.get('blobS'));
    formData.append('dataFile2', JSON.stringify(this.generateJson('Vivienda_Interior', fecha)));

    } else {

    this.dataP.setDocCode1('IDOFA');
    this.dataP.setOperID1(this.dataClient.operationID.toString());
    this.dataP.setActivityStatus1('OK');
    this.dataP.setLat(photos.get(3));
    this.dataP.setLng(photos.get(4));
    formData.append('jsonRequest', JSON.stringify(this.dataP));
    formData.append('file1', photos.get('blobP'));
    formData.append('dataFile1', JSON.stringify(this.generateJson('Vivienda_Exterior', fecha)));

    }

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.login.token
    });

    console.log(JSON.stringify(formData));

    return this.http.post(URL_SERVICIOS + '/documents/upload', formData, {headers})
              .subscribe( data => {
                this.result = data['resultOK'];
                this.message = data['message'];

                console.log(data);
                console.log('Servicios de fotos' + this.message);

                this.loading.dismiss();
                photos.clear();
                this.finishedVisit();

              }, async error => {
                this.result = error['resultOK'];
                this.message = error['message'];
                console.log(error);

                this.loading.dismiss();
                photos.clear();

                const alert = await this.alertCtrl.create({
                  mode: 'ios',
                  header: '¡Ups!',
                  message: 'Ocurrio un problema en la conexion',
                  buttons: [
                    {
                      text: 'Regresar',
                      role: 'volver',
                      cssClass: 'secondary',
                      handler: (blah) => {
                        // Accion del boton
                      }
                    }, {
                      text: 'Reintentar',
                      handler: () => {
                        this.sendPhotos(this.getPhotosServ(), this.getFechaServ());
                      }
                    }
                  ]
                });
                await alert.present();

              });

  }

  generateJson( name: string, fecha: string) {

    const jsonF = {
    'docType': 'bid:Anverso',
    'bid:Nombre': name,
    'bid:PrimerApellido': name,
    'bid:SegundoApellido': name,
    'bid:IDENTIFICACION': '123549',
    'bid:Fecha': fecha,
    'bid:TipoID': 'INE',
    'bid:ScanId': '123123'};

    return jsonF;

  }

  saveRazones( razon: string, actividad: string, define: boolean) {

    this.setRazonServ(razon);
    this.setActividadServ(actividad);
    this.setDefineServ(define);

    if (define) {
      this.loading.present('Finalizando..');
    } else {

    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.login.token
    });

    return this.http.put(URL_SERVICIOS + '/operations', JSON.stringify(this.razonesJ(razon, actividad)), {headers})
            .subscribe( data => {
              this.resultR = data['error'];
              this.messageR = data['message'];
              console.log(data);
              console.log('SaveRazones' + this.messageR);

              if (define) {
                this.loading.dismiss();
                this.finishedVisit();
              } else {

              }

            }, async error => {
              this.resultR = error['error'];
              this.messageR = error['message'];
              console.log('SaveRazones' + JSON.stringify(error));

              if (define) {

                this.loading.dismiss();

                const alert = await this.alertCtrl.create({
                  mode: 'ios',
                  header: '¡Ups!',
                  message: 'Ocurrio un problema en la conexion',
                  buttons: [
                    {
                      text: 'Regresar',
                      role: 'volver',
                      cssClass: 'secondary',
                      handler: (blah) => {
                        // Accion del boton
                      }
                    }, {
                      text: 'Reintentar',
                      handler: () => {
                        this.saveRazones(this.getRazonServ(), this.getActividadServ(), this.getDefineServ());
                      }
                    }
                  ]
                });
                await alert.present();

              } else {

              }

            });
  }

  asignar(address: number) {

    this.setDireccionServ(address);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.login.token
    });

    return this.http.put(URL_SERVICIOS + '/list/assign/customers', JSON.stringify(this.asignarJ(address)), {headers})
                .subscribe( data => {

                  console.log(data);

                }, async error => {

                  const alert = await this.alertCtrl.create({
                    mode: 'ios',
                    backdropDismiss: false,
                    header: '¡Ups!',
                    subHeader: 'Ocurrio un error en la conexion',
                    buttons: [{
                      text: 'Reitentar',
                      role: 'reintentar',
                      cssClass: 'secondary',
                      handler: () => {
                        // accion del boton
                        this.asignar(this.getDireccionServ());
                      }
                    },
                  ]
                  });
                  await alert.present();
                });

  }

  razonesJ(razon: string, actividad: string) {

    const jsonR = {
      'data': {
        'activityStatus': actividad,
        'data': '{"razon": "' + razon + '" }',
        'productId': 1,
        'secuence': 15,
        'workflowId': 1
      },
      'metadata': {
        'timeZoneId': 1,
        'userId': this.login.typeUser
      },
      'operationId': this.dataClient.operationID
    };

    console.log(jsonR);
    return jsonR;
  }

  asignarJ(address: number) {

    const jsonA = {
      'data': {
        'addressId': address
       },
       'metadata': {
         'accuracy': 0,
         'deviceInfo': '',
         'latutide': 0,
         'longitude': 0,
         'timeZoneId': 1,
         'userId': this.login.typeUser
       },
       'operationId': 0
    }

    console.log(jsonA);
    return jsonA;
  }

  finishedVisit() {
    this._store.cerrarSesion();
    this.navCtrl.navigateRoot('login');
  }


}
