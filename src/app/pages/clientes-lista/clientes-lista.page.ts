import { Component, OnInit, ViewChild} from '@angular/core';
import { DataClientesService } from '../../services/data-clientes.service';
import { IonList, NavController, AlertController} from '@ionic/angular';
import { EstadosMunicipiosService } from '../../services/estados-municipios.service';
import { GuardarStorageService } from '../../services/guardar-storage.service';
import { ActivatedRoute } from '@angular/router';
import { PhotosService } from '../../services/photos.service';
import { IdValue } from '../../objetosDTO/id-value';
import { AlertService } from '../../herramientas/alert.service';
import { environment } from 'src/environments/environment';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.page.html',
  styleUrls: ['./clientes-lista.page.scss'],
})

export class ClientesListaPage implements OnInit {

  @ViewChild('lista') lista: IonList;
  clientes: any;
  arrayBuscar = '';
  selectSt: number;
  loading = false;
  selectMuni = '';
  state: any[]=[];
  jsonMuni: any[]=[];
  arrayLocality: string[] = [];
  resMessage: string;
  resCode: number;
  recargar: any;
  ejemplo: any;
  stateSplit: any[];
  citySplit: any[];
  stateNombre: string;
  cityNombre: string;
  // evaluar: boolean;
  evaluar = null;

  constructor(private dataClient: DataClientesService,
              private navCtrl: NavController,
              private localityS: EstadosMunicipiosService,
              private _store: GuardarStorageService,
              private alertServ: AlertService,
              private phhotoServ: PhotosService,
              private loadingServ: LoadingService) {

                console.log(this.stateNombre);
                console.log(this.cityNombre);
                console.log(this.clientes);

               }

               

  ngOnInit() {  }

  ionViewWillEnter() {
    this.phhotoServ.cambiarStatus(false);
    this.clientes = null;
    this.regreso();
  }

  async regreso() {

    this.evaluar = await this._store.cargarStorage('recargar');
    console.log('Recargar', this.evaluar);
    
    if ((this.stateNombre !== undefined && this.stateNombre !== null) && (this.cityNombre !== undefined && this.cityNombre !== null)) {
      
      this.loading = true;
      this.verifyStorage();

    } else {
      this.loadingServ.present('Cargando...');

      this.localityS.generateState().subscribe( data => {
        console.log(data);
        this.loadingServ.dismiss();

        if(data['code'] == -9999) {

          data['data'].forEach(elemento => {
          let idValue: IdValue = new IdValue();
          idValue.setId(elemento[0]);
          idValue.setValue(elemento[1]);
          this.state.push(idValue);
          });

          this.state.sort();
          // console.log(this.state);
          
        } else {
          this.alertServ.alertaSimple(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_200, 'verde', 'Entiendo');
        }
        
      }, error => {
        this.loadingServ.dismiss();
        this.alertServ.alertaAction(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_ERROR, 'rojo', 'Reitentar', ()=> { this.regreso() });
      });
    }
  }
  
  async verifyStorage() {
    this.stateNombre = await this._store.cargarStorage('stateNombre');
    this.cityNombre = await this._store.cargarStorage('cityNombre');
    this._store.limpiarStorage('recargar');
    this.servicioLista();

  }

  direccion(user) {
    this._store.guardarStorage('stateNombre', this.stateNombre);
    this._store.guardarStorage('cityNombre', this.cityNombre);
    this._store.limpiarStorage('recargar');

    this.state = [];
    this.jsonMuni = [];

    console.log(user);
    this._store.address_St = null;
    this.dataClient.setUser(user);
    this.dataClient.operationID = user.operationId;
    this.navCtrl.navigateForward('direcciones');
  }

  seguimiento(user) {
    this._store.guardarStorage('stateNombre', this.stateNombre);
    this._store.guardarStorage('cityNombre', this.cityNombre);

    this.state = [];
    this.jsonMuni = [];

    console.log(user);
    this.dataClient.setUser(user);
    this.dataClient.operationID = user.operationId;
    this.navCtrl.navigateForward('vivienda');
  }

  estatus(user) {
    this.lista.closeSlidingItems();
  }

  buscar(event) {
    this.arrayBuscar = event.detail.value;
  }

  selectState(event) {
    this.loadingServ.present('Cargando Municipios...');

    this.jsonMuni = [];
    this.clientes = null;

    console.log(event);
    // this.stateSplit = event.detail.value.split('|');
    this.selectSt = event.detail.value.id;
    this.stateNombre = event.detail.value.value;
    console.log(this.selectSt);

    this.localityS.generateMuni(this.selectSt).subscribe( data => {
      console.log('Ciudad ', data);
      this.loadingServ.dismiss();

      if(data['code'] == -9999) {
        data['data'].forEach(elemento => {
        let idValue: IdValue = new IdValue();
        idValue.setId(elemento[0]);
        idValue.setValue(elemento[1]);
        this.jsonMuni.push(idValue);

        });
        this.jsonMuni.sort();

      } else {
        this.alertServ.alertaSimple(environment.ERROR_PROBLEMA, environment.ERROR_CONEXION_200, 'verde', 'Entiendo');
      }
    }, error => {
      this.loadingServ.dismiss();
      this.alertServ.alertaSimple(environment.ERROR_PROBLEMA, 'Vuelva a seleccionar el estado por favor', 'verde', 'Entiendo');
    });
  }

  selectMunicipio(event) {
    console.log('Detalle municipio', event);
    this.selectMuni = event.detail.value.id;
    this.cityNombre = event.detail.value.value;
    console.log(this.selectMuni, this,this.cityNombre);
    this.clientes = null;
    this.resCode = null;
    this.loading = true;

    this.servicioLista();
  }


  servicioLista() {
    this.dataClient.getUsers(this.stateNombre, this.cityNombre).subscribe( data => {
      console.log(data);

      this.loading = false;
      if (data['code'] === -9999) {
        this.clientes = data['data']['pendingsList'];

      } else {
        this.resCode = data['code'];

      }

    }, async error => {
      console.log(error);
      this.alertServ.alertaSimple(environment.ERROR_PROBLEMA, 'Ocurrio un problema al generar la lista de clientes, por favor vuela a seleccionar estado y municipio', 'verde', 'Entiendo');
    });
  }

  salirLogin() {
    this._store.limpiarStorageGeneral();
    this.navCtrl.navigateRoot('login');
  }

}
