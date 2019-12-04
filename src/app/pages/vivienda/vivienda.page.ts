import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavController, AlertController } from '@ionic/angular';
import { PhotoEnum } from '../../enums/photo-num';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { PhotosService } from '../../services/photos.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GuardarStorageService } from '../../services/guardar-storage.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-vivienda',
  templateUrl: './vivienda.page.html',
  styleUrls: ['./vivienda.page.scss'],
})
export class ViviendaPage implements OnInit {

  private ingreso = true;
  private existe_vivienda = true;
  photos: any;
  razon_array: any[] = [{ razon: 'No vive ahi' }, { razon: 'No se permitio el acceso'}, { razon: 'No se encontraba quien me atendiera'}];
  razon_no: any[] = [{ razon: 'No se ubico la vivienda' }, { razon: 'La direccion no existe'}];
  select_razon: string;
  select_razon_ninguna: string;
  lat: Number;
  lon: Number;
  fechaISO: any;
  localISOTime: any;
  tzoffset: any;
  arrayFecha: any[];
  fecha: string;

  constructor(private camera: Camera,
              private geolocation: Geolocation,
              public pService: PhotosService,
              private alertCtrl: AlertController,
              private _store: GuardarStorageService,
              private navCtrl: NavController,
              private router: Router,
              private loginSrv: LoginService,) {
      this.photos = new Map();
      this.getGeolocation();

      this.tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
      this.localISOTime = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
      this.arrayFecha = this.localISOTime.split('.');
      this.fecha = this.arrayFecha[0] + 'Z';

      this.fechaISO = new Date().toISOString();
   }

  ngOnInit() {
    this.loginSrv.generateToken();

  }

  regresar() {
    this._store.guardarStorage('recargar', true);
    this.navCtrl.navigateRoot('clientes-lista');
  }

  tomarFoto( key: PhotoEnum ) {
    let photo: any;
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      photo = 'data:image/jpeg;base64,' + imageData;
      this.photos.set(key, photo);
      if (key === 1) {
        const blob = this.b64toBlob(imageData, 'image/jpeg', 512);
        this.photos.set('blobP', blob);
      } else {
        const blob = this.b64toBlob(imageData, 'image/jpeg', 512);
        this.photos.set('blobS', blob);
      }
    console.log('INFORMACION DEL MAP' + this.photos.get(1));
    console.log('TAMAÑO DEL MAP' + this.photos.size);
    }, (err) => {
      console.log(err);
    });
  }

  change_existe() {
    console.log('Existe la vivienda:' + this.existe_vivienda);
    if (!this.existe_vivienda) {
      this.photos.delete(1);
      this.photos.delete(2);
    }
  }

  change() {
    console.log('Logro ingresar:' + this.ingreso);
    if (!this.ingreso) {
      this.photos.delete(2);
    }
  }

  razon_no_entro(razon) {
    this.select_razon = razon.razon;
    console.log(this.select_razon);
  }

  razon_no_fotos(razon) {
    this.select_razon_ninguna = razon.razon;
    console.log(this.select_razon_ninguna);
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      this.lat = geoposition.coords.latitude;
      this.photos.set(3, this.lat);
      this.lon = geoposition.coords.longitude;
      this.photos.set(4, this.lon);
    });
  }

  b64toBlob(b64Data: string, contentType: string, sliceSize: number) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  sendPhoto() {

    if (this.existe_vivienda && this.ingreso) {
      // Deben de venir ambas fotos
      if (this.photos.has(1) && this.photos.has(2)) {

        let razones: any[] = [];
        razones.push('Visita domiciliaria finalizada exitosamente.');
        razones.push('FINALIZADO');
        razones.push(true);

        this.pService.sendPhotos(this.photos, this.fecha, razones);
      } else {
        this.presentAlert('Capture las dos fotos que se le pide');
      }
    }


    if (!this.existe_vivienda) {
      // No encontro vivienda
      console.log('No se encontro la vivienda');
      if (this.select_razon_ninguna != null && this.select_razon !== '') {
        this.pService.saveRazones(this.select_razon_ninguna, 'PAUSADO', true);
      } else {
        // En caso de que no se haya capturado ningun fotografia
        this.presentAlert('Seleccione una razon por la que no tomo ninguna fotografia');
      }

    }


    if (this.existe_vivienda && !this.ingreso) {
      // No ingreso a la vivienda, servicio para mandar informacion
      if (this.photos.has(1) && !this.photos.has(2)) {
        if (this.select_razon !== null && this.select_razon !== '') {

          let razones: any[] = [];
          razones.push(this.select_razon);
          razones.push('FINALIZADO');
          razones.push(true);

          this.pService.sendPhotos(this.photos, this.fecha, razones);

        } else {
          // En caso de que no se haya elejido ningun radio buton
          this.presentAlert('Seleccione una razon por la que no ingreso a la vivienda');
        }
      }
    }

    this.photos.clear();

  }

  async presentAlert( subHeader: string ) {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      backdropDismiss: false,
      header: '¡Faltan datos!',
      subHeader,
      buttons: [{
        text: 'Regresar',
        role: 'Regresar',
        cssClass: 'secondary',
        handler: () => {
          // Accion del boton
        }
      },
    ]
    });
    await alert.present();
  }

  irLista() {
    this._store.guardarStorage('recargar', true);
    this.navCtrl.navigateRoot('clientes-lista');
  }

  salirApp() {
    this._store.limpiarStorageGeneral();
    this.navCtrl.navigateRoot('login');
  }

}
