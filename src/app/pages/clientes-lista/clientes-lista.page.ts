import { Component, OnInit, ViewChild} from '@angular/core';
import { DataClientesService } from '../../services/data-clientes.service';
import { IonList, NavController, AlertController } from '@ionic/angular';
import { EstadosMunicipiosService } from '../../services/estados-municipios.service';
import { GuardarStorageService } from '../../services/guardar-storage.service';
import { ActivatedRoute } from '@angular/router';

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
  selectEs: string;
  loading = false;
  selectMuni = '';
  state: any;
  jsonMuni: any;
  arrayLocality: string[] = [];
  resMessage: string;
  resCode: number;
  recargar: any;

  constructor(private dataClient: DataClientesService,
              private navCtrl: NavController,
              private localityS: EstadosMunicipiosService,
              private _store: GuardarStorageService,
              private alertCtrl: AlertController,
              private route: ActivatedRoute) {

                  this.localityS.generateState().subscribe( data => {
                    this.state = data;
                    // console.log(this.state);
                  });

                  // this.route.params.subscribe(data => {
                  //   this.recargar = data;
                  // });

                  // console.log(this.recargar);
                  // console.log(this.selectSt);
                  // console.log(this.selectMuni);
                  

               }

  ngOnInit() {
  }

  estatus(user) {
    this.lista.closeSlidingItems();
  }

  buscar(event) {
    this.arrayBuscar = event.detail.value;
  }

  selectState(event) {
    console.log(event);
    this.selectSt = event.detail.value.id_value;
    console.log(this.selectSt);
    this.selectEs = event.detail.value.name;
    this.clientes = null;

    this.localityS.generateMuni(this.selectSt.toString()).subscribe( data => {
      this.jsonMuni = data;
      console.log(this.jsonMuni);
    });
  }

  selectMunicipio(event) {
    // console.log(event);
    this.selectMuni = event.detail.value;
    this.clientes = null;
    this.resCode = null;
    this.loading = true;

    this.servicioLista();
  }

  direccion(user) {
    console.log(user.operationId);
    this._store.address_St = null;
    this.dataClient.setUser(user);
    this.dataClient.operationID = user.operationId;
    this.navCtrl.navigateForward('direcciones');
  }

  seguimiento(user) {
    console.log(user.operationId);
    this.dataClient.setUser(user);
    this.dataClient.operationID = user.operationId;
    this.navCtrl.navigateForward('vivienda');
  }


  servicioLista() {

    this.dataClient.getUsers(this.selectEs, this.selectMuni).subscribe( data => {

      this.loading = false;
      // console.log(data);
      if (data['code'] === -9999) {
        
        this.clientes = data['data']['pendingsList'];

      } else {
        this.resCode = data['code'];
        // console.log(this.resCode);

      }

    }, async error => {
      console.log(error);

      const alert = await this.alertCtrl.create({
        mode: 'ios',
        header: '¡Ups!',
        message: 'Ocurrio un problema en la conexion',
        buttons: [
          {
            text: 'Cambiar parametros',
            role: 'volver',
            cssClass: 'secondary',
            handler: (blah) => {
              // Accion del boton
            }
          }, {
            text: 'Reintentar',
            handler: () => {
              this.servicioLista();
            }
          }
        ]
      });
      await alert.present();
    });
  }

}
