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
import { Router } from '@angular/router';
import { AlertService } from '../herramientas/alert.service';
import { environment } from '../../environments/environment';

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
  procesoFinalizado: boolean;

  private photosServ: any;
  private fechaServ: any;
  private razonServ: any;
  private actividadServ: any;
  private defineServ: any;
  private direccionServ: any;

  constructor(private http: HttpClient,
              private login: LoginService,
              private alertCtrl: AlertService,
              private navCtrl: NavController,
              private _store: GuardarStorageService,
              private razones: RazonesService,
              private loading: LoadingService,
              private dataClient: DataClientesService,
              private router: Router) {}

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


  sendPhotos( photos: any, fecha: any, arrayRazones: any[]) {

    this.loading.present('Guardando fotos..');

    setTimeout(() => {
        this.loading.dismiss();
        this.saveRazones(arrayRazones[0], arrayRazones[1], arrayRazones[2]);

    }, 4000);

    // this.setPhotosServ(photos);
    // this.setFechaServ(fecha);

    // this.loading.present('Guardando fotos..');

    // const formData = new FormData();
    // console.log(photos.size);

    // console.log('Operation ID -------' + this.dataClient.operationID.toString());
    // if (photos.has(1) && photos.has(2)) {

    // this.dataP.setDocCode1('IDOFA');
    // this.dataP.setDocCode2('IDOFB');
    // this.dataP.setOperID1(this.dataClient.operationID.toString());
    // this.dataP.setOperID2(this.dataClient.operationID.toString());
    // this.dataP.setActivityStatus1('FINALIZADO');
    // this.dataP.setActivityStatus2('FINALIZADO');
    // this.dataP.setLat(photos.get(3) ? photos.get(3) : 19 );
    // this.dataP.setLng(photos.get(4) ? photos.get(4) : -90);
    // formData.append('jsonRequest', JSON.stringify(this.dataP));
    // formData.append('file1', photos.get('blobP'));
    // formData.append('dataFile1', JSON.stringify(this.generateJson('Vivienda_Exterior', fecha)));
    // formData.append('file2', photos.get('blobS'));
    // formData.append('dataFile2', JSON.stringify(this.generateJson('Vivienda_Interior', fecha)));

    // } else {

    // this.dataP.setDocCode1('IDOFA');
    // this.dataP.setOperID1(this.dataClient.operationID.toString());
    // this.dataP.setActivityStatus1('OK');
    // this.dataP.setLat(photos.get(3));
    // this.dataP.setLng(photos.get(4));
    // formData.append('jsonRequest', JSON.stringify(this.dataP));
    // formData.append('file1', photos.get('blobP'));
    // formData.append('dataFile1', JSON.stringify(this.generateJson('Vivienda_Exterior', fecha)));

    // }

    // const headers = new HttpHeaders({
    //   'Authorization': 'Bearer ' + this.login.token
    // });

    // console.log(JSON.stringify(formData));

    // return this.http.post(URL_SERVICIOS + '/documents/upload', formData, {headers}).subscribe( data => {
    //   console.log('Upload Fotos', data);

    //   this.loading.dismiss();
    //   this.saveRazones(arrayRazones[0], arrayRazones[1], arrayRazones[2]);

    //   // if(data['code'] === -9999) {
    //   //   this.result = data['resultOK'];
    //   //   this.message = data['message'];
    //   //   photos.clear();
    //   //   this.saveRazones(arrayRazones[0], arrayRazones[1], arrayRazones[2]);

    //   // } else {
    //   //   this.alertCtrl.alertaSimple(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_200, 'verde', 'Entiedno');
    //   // }
    // }, error => {
    //     this.result = error['resultOK'];
    //     this.message = error['message'];
    //     console.log(error);

    //     this.loading.dismiss();
    //     this.saveRazones(arrayRazones[0], arrayRazones[1], arrayRazones[2]);

    //     // photos.clear();
    //     // this.alertCtrl.alertaAction(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_ERROR, 'rojo', 'Reitentar', ()=> { this.sendPhotos(this.getPhotosServ(), this.getFechaServ(), arrayRazones) });

    //   });

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
      this.loading.present('Finalizando visita..');
    } 

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.login.token
    });

    return this.http.put(URL_SERVICIOS + '/operations', JSON.stringify(this.razonesJ(razon, actividad)), {headers}).subscribe( data => {
      console.log('Save Rasones', data);

      if(data['code'] === -9999) {
        this._store.guardarStorage('seEnvio', true);
        this.resultR = data['error'];
        this.messageR = data['message'];

        if (define) {
          this.loading.dismiss();
          this.cambiarStatus(true);
        }

      } else {
          this.alertCtrl.alertaSimple(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_200, 'Entiedno', 'verde'); 
      }

      }, async error => {
        console.log('SaveRazones' + error);
        this.resultR = error['error'];
        this.messageR = error['message'];

        if (define) {
          this.loading.dismiss();
          this.alertCtrl.alertaAction(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_ERROR, 'rojo', 'Reitentar', ()=> { this.saveRazones(this.getRazonServ(), this.getActividadServ(), this.getDefineServ()) });

        }

      });
  }

  asignar(address: number, arrayRazones: any[]) {

    this.loading.present('Asignando visita');
    this.setDireccionServ(address);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.login.token
    });

    return this.http.put(URL_SERVICIOS + '/list/assign/customers', JSON.stringify(this.asignarJ(address)), {headers}).subscribe( data => {
        console.log('Respuesta de asignar', data);
        
        if(data['code'] === -9999) {
          this.saveRazonesFirst(arrayRazones[0], arrayRazones[1], false);

        } else {
          this.loading.dismiss();
          this.alertCtrl.alertaSimple(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_200, 'Entiedno', 'verde'); 
        }

      }, async error => {
        this.loading.dismiss();
        this.alertCtrl.alertaAction(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_ERROR, 'rojo', 'Reitentar', ()=> { this.asignar(address, arrayRazones) });
      });

  }

  saveRazonesFirst(razon: string, actividad: string, loading: boolean) {

    if(loading) {
      this.loading.present('Asignando visita...');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.login.token
    });

    return this.http.put(URL_SERVICIOS + '/operations', JSON.stringify(this.razonesJ(razon, actividad)), {headers}).subscribe( data => {
      console.log('Save RasonesFirst', data);
      this.loading.dismiss();

      if(data['code'] === -9999) {
        this.navCtrl.navigateForward('vivienda');
      } else {
        this.alertCtrl.alertaAction(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_200, 'rojo', 'Reitentar', ()=> { this.saveRazonesFirst(razon, actividad, true) });
      }

      }, async error => {
        this.loading.dismiss();
        console.log('SaveRazones' + error);
        this.alertCtrl.alertaAction(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_ERROR, 'rojo', 'Reitentar', ()=> { this.saveRazonesFirst(razon, actividad, true) });

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

    console.log('JSON Asignar', jsonA);
    return jsonA;
  }

  finishedVisit() {
    this._store.cerrarSesion();
    this.navCtrl.navigateBack('clientes-lista');
    // this.router.navigate(['/clientes-lista', {recargar: true}]);
  }

  cambiarStatus(value: boolean) {
    this.procesoFinalizado = value;
    console.log('Valor de los botones', this.procesoFinalizado);
    
  }


}
