import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { JsonDatosActivity } from './actividades/model/json-datos-activity.model';
import { Cliente } from '../pages/tipo-identificacion/consulta-similitud-confirmacion/model/Cliente.model';
import { ResumenDoctos } from '../pages/contrato/firma-contrato/model/resumen-doctos.model';

@Injectable({
  providedIn: 'root'
})

export class GuardarStorageService {

  address_St = '';
  state_St = '';
  municipio_St = '';
  capturasF: any; capturasB: any;
  analisisOCR: any;
  tasReferences: any = [];
  anversoIdContrato: any; 
  reversoIdContrato: any;
  operationID: any; 
  datosDomicilio: any; 
  imagenDomicilio: any;
  private tipoINE: any;
  private ineAnverso: any;
  private ineReverso: any;
  private personId: number;
  private jsonDatosActivity: JsonDatosActivity;
  private bearerToken: string;
  private tipoFlujo: string;
  private tipoIdentificacion: string;
  private cliente: Cliente;
  private resumenDoctos: ResumenDoctos[];
  private resBuro: string;


    public getResBuro(): string {
        return this.resBuro;
    }

    public setResBuro(resBuro: string): void {
        this.resBuro = resBuro;
    }


    public getResumenDoctos(): ResumenDoctos[] {
        return this.resumenDoctos;
    }

    public setResumenDoctos(resumenDoctos: ResumenDoctos[]): void {
        this.resumenDoctos = resumenDoctos;
    }

    public getCliente(): Cliente {
        return this.cliente;
    }

    public setCliente(cliente: Cliente): void {
        this.cliente = cliente;
    }


  public getIneAnverso(): any {
    return this.ineAnverso;
}

public setIneAnverso(ineAnverso: any): void {
    this.ineAnverso = ineAnverso;
}

public getIneReverso(): any {
    return this.ineReverso;
}

public setIneReverso(ineReverso: any): void {
    this.ineReverso = ineReverso;
}

    public getTipoINE(): any {
        return this.tipoINE;
    }

    public setTipoINE(tipoINE: any): void {
        this.tipoINE = tipoINE;
    }

    public getTipoIdentificacion(): string {
        return this.tipoIdentificacion;
    }

    public setTipoIdentificacion(tipoIdentificacion: string): void {
        this.tipoIdentificacion = tipoIdentificacion;
    }



  
  public getPersonId(): number {
    return this.personId;
}

public setPersonId(personId: number): void {
    this.personId = personId;
}
  public getJsonDatosActivity(): JsonDatosActivity {
    return this.jsonDatosActivity;
}

public setJsonDatosActivity(jsonDatosActivity: JsonDatosActivity): void {
    this.jsonDatosActivity = jsonDatosActivity;
}

    public getTipoFlujo(): string {
        return this.tipoFlujo;
    }

    public setTipoFlujo(tipoFlujo: string): void {
        this.tipoFlujo = tipoFlujo;
    }




  constructor(private platform: Platform,
              private storage: Storage,
              private sqlite: SQLite,
              private plaform: Platform) { }

   // getDatosDomicilio
   setImagenDomicilio(imagenDomicilio: any) {
    this.imagenDomicilio = imagenDomicilio;
  }

  getImagenDomicilio() {
    return this.imagenDomicilio;
  }

  // getDatosDomicilio
  setDatosDomicilio(datosDomicilio: any) {
    this.datosDomicilio = datosDomicilio;
  }

  getDatosDomicilio() {
    return this.datosDomicilio;
  }

  setOperationID(operationID: any) {
    this.operationID = operationID;
  }

  getOperationID() {
    return this.operationID;
  }

  setAnversoIdContrato(anversoIdContrato: any) {
    this.anversoIdContrato = anversoIdContrato;
  }

  getAnversoIdContrato() {
    return this.anversoIdContrato;
  }

  setReversoIdContrato(reversoIdContrato: any) {
    this.reversoIdContrato = reversoIdContrato;
  }

  getReversoIdContrato() {
    return this.reversoIdContrato;
  }

  setTasReferences(tasReferences: any) {
    this.tasReferences = tasReferences;

  }

  getTasReferences() {
    return this.tasReferences;
  }

  setDatosOCR(analisis: any) {
    this.analisisOCR = analisis;
  }

  getDatosOCR() {
    return this.analisisOCR;
  }
  public getBearerToken(): string {
      return this.bearerToken;
  }

  public setBearerToken(bearerToken: string): void {
      this.bearerToken = bearerToken;
  }

  obtenerStorageImagenF() {
    return this.capturasF;
  }

  obtenerStorageImagenB() {
   return this.capturasB;
  }

  guardarStorageImagenB(data: any) {
  this.capturasB = data;
  }

  guardarStorageImagenF(data: any) {

    this.capturasF = data;
  }

  // ******************* Storage ***********************

  cargarStorage(key: string): any {

    if (this.plaform.is('cordova')) {
      // celular
      return this.storage.get(key).then(data => {
          return data;
      });
    } else {
      // computadora
      if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
      }
    }

    return null;

  }

  guardarStorage(key: string, value: any) {

    if (this.plaform.is('cordova')) {
      // celular
      this.storage.set(key, value);
    } else {
      // computadora
      localStorage.setItem(key, JSON.stringify(value));
    }
    
  }

  cerrarSesion() {
    this.address_St = null;
    this.state_St = null;
    this.municipio_St = null;
  }

  limpiarStorage(key: string) {
      this.storage.remove(key);
  }

  limpiarStorageGeneral() {
    this.storage.clear();
  }
}
