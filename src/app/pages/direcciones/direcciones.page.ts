import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataClientesService } from '../../services/data-clientes.service';
import { GuardarStorageService } from '../../services/guardar-storage.service';
import { RazonesService } from '../../services/razones.service';
import { PhotosService } from '../../services/photos.service';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage implements OnInit {

  user: any;

  constructor(private navCtrl: NavController,
              private dataClient: DataClientesService,
              private _store: GuardarStorageService,
              private razones: RazonesService,
              private photoS: PhotosService) {

                this.user = this.dataClient.getUser();
                console.log('DireccionUser', this.user);
                
                  
              }

  ngOnInit() {
  }

  toVisit() {
    this.razones.setProductId(this.user.productId);
    this.razones.setSecuence(this.user.secuence);
    this.razones.setWorkflowId(this.user.workflowId);
    this.razones.setOperationId(this.user.operationId);
    console.log(this.user.operationId);

    let arrayRazones: any[] = [];
    arrayRazones.push('Inicio el proceso de visita');
    arrayRazones.push('EN PROCESO');

    this.photoS.asignar(this.user.addressId, arrayRazones);
    
  }

  listaC() {
    // this.navCtrl.navigateBack('clientes-lista');
    this._store.guardarStorage('recargar', true);
    this.navCtrl.navigateRoot('clientes-lista');
  }

  salirLogin() {
    this._store.limpiarStorageGeneral();
    this.navCtrl.navigateRoot('login');
  }

}
