import { Component, OnInit } from '@angular/core';
import { CatalogoValuesOut } from 'src/app/services/catalogos/model/catalogo-values-out.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cliente } from '../tipo-identificacion/consulta-similitud-confirmacion/model/Cliente.model';
import { Regex } from 'src/app/herramientas/regex';
import { CatalogoService } from 'src/app/services/catalogos/catalogo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GuardarStorageService } from 'src/app/services/guardar-storage.service';
import { NavController } from '@ionic/angular';
import { JsonData } from 'src/app/services/actividades/model/json-data.model';
import { JsonAddress } from 'src/app/services/actividades/model/json-address.model';
import { JsonPersonalData } from 'src/app/services/actividades/model/json-personal-data.model';
import { JsonInnerData } from 'src/app/services/actividades/model/json-inner-data.model';
import { JsonMetadata } from 'src/app/services/actividades/model/json-metadata.model';
import { JsonDatosActivity } from 'src/app/services/actividades/model/json-datos-activity.model';
import { ActivitiesService } from 'src/app/services/actividades/activities-service';

@Component({
  selector: 'app-info-grales',
  templateUrl: './info-grales.page.html',
  styleUrls: ['./info-grales.page.scss'],
})
export class InfoGralesPage implements OnInit {

  infoClienteForm: FormGroup;
  cliente: Cliente;
  catalogoTipoCliente: CatalogoValuesOut[]=[];
  catalogoTipoId: CatalogoValuesOut[]=[];
  catalogoNacionalidad: CatalogoValuesOut[]=[];
  catalogoSexo: CatalogoValuesOut[]=[];
  catalogoEdoCivil: CatalogoValuesOut[]=[];
  catalogoRangoSalar: CatalogoValuesOut[]=[];
  catalogoActEmpresa: CatalogoValuesOut[]=[];
  catalogoPais: CatalogoValuesOut[]=[];
  catalogoTipoDomic: CatalogoValuesOut[]=[];
  catalogoEstado: CatalogoValuesOut[]=[];
  catalogoCiudad: CatalogoValuesOut[]=[];
  catalogoColonia: CatalogoValuesOut[]=[];
  regex: Regex = new Regex();
  catalogosCargados: number = 0;
  bearer: string;
  secuenciaId: number;

  constructor(
    private formBuilder: FormBuilder,
    private catalogoService: CatalogoService,
    private guardarS: GuardarStorageService,
    private navCtrl: NavController,
    private activityService: ActivitiesService
    ) 
    { 
      // this.bearer = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsibXMvYWRtaW4iLCJ0a24vZXNwIiwibXMvdXNlciIsIm13L2FkbWluYXBwIiwiYmlkIl0sInVzZXJfbmFtZSI6ImZyZCIsInNjb3BlIjpbInJvbGVfdXNlciJdLCJleHAiOjE1NTk1MzM5MjIsImF1dGhvcml0aWVzIjpbImNhbl91cGRhdGVfdXNlciIsInJvbGVfdXNlciJdLCJqdGkiOiI2NWEzYzljYS0zZjhhLTQ5M2YtOTcxMi1lY2NmOGRiZTRhYzQiLCJjbGllbnRfaWQiOiJ1c2VyYXBwIn0.JXb9-7Uugh-8Nsbh_jywtY06LAZU3V0UfTUgC392Fkw";
      this.bearer = this.guardarS.getBearerToken();
      this.cliente = this.guardarS.getCliente();
      
      this.secuenciaId = 0;
      if(this.guardarS.getTipoFlujo() == "alhajas")
      {
        this.secuenciaId = 5;
      }
      else
      {
        this.secuenciaId = 10;
      }
    }

  ngOnInit() {
  this.catalogoService.obtenerElementosCatalogoPorNombreDep2("persontype", this.bearer).subscribe(
      (respuesta: any) =>{
        if(respuesta.code == -9999)
        {
          respuesta.data.forEach(elemento => {
          let elementoCat = new CatalogoValuesOut(elemento[0],elemento[1],"","",0);
          this.catalogoTipoCliente.push(elementoCat);
          });
          this.catalogosCargados += 1;
        }
      },
      (err: HttpErrorResponse)=>{
        console.log(err)
      });
    this.catalogoService.obtenerElementosCatalogoPorNombreDep("Nacionalidad",this.bearer).subscribe(
      ((respuesta: any) =>{
         this.catalogoNacionalidad = respuesta;
         this.catalogosCargados += 1;
      })
    );
    this.catalogoService.obtenerElementosCatalogoPorNombreDep("Sexo",this.bearer).subscribe(
      ((respuesta: any) =>{
         this.catalogoSexo = respuesta;
         this.catalogosCargados += 1;
      })
    );
    this.catalogoService.obtenerElementosCatalogoPorNombreDep("Estado Civil",this.bearer).subscribe(
      ((respuesta: any) =>{
         this.catalogoEdoCivil = respuesta;
         this.catalogosCargados += 1;
      })
    );
    this.catalogoService.obtenerElementosCatalogoPorNombreDep("Rango Salarial",this.bearer).subscribe(
      ((respuesta: any) =>{
         this.catalogoRangoSalar = respuesta;
         this.catalogosCargados += 1;
      })
    );
    this.catalogoService.obtenerElementosCatalogoPorNombreDep("Actividad empresarial",this.bearer).subscribe(
      ((respuesta: any) =>{
         this.catalogoActEmpresa = respuesta;
         this.catalogosCargados += 1;
      })
    );
    
    this.catalogoService.obtenerElementosCatalogoPorNombreDep2("country", this.bearer).subscribe(
      (respuesta: any) =>{
        if(respuesta.code == -9999)
        {
          respuesta.data.forEach(elemento => {
          let elementoCat = new CatalogoValuesOut(elemento[0],elemento[1],"","",0);
          this.catalogoPais.push(elementoCat);
          });
          this.catalogosCargados += 1;
        }
      },
      (err: HttpErrorResponse)=>{
        console.log(err)
      });
    this.catalogoService.obtenerElementosCatalogoPorNombreDep("Tipo domicilio",this.bearer).subscribe(
      ((respuesta: any) =>{
         this.catalogoTipoDomic = respuesta;
         this.catalogosCargados += 1;
      })
    );
    this.catalogoService.obtenerElementosCatalogoPorNombreDep("Nacionalidad",this.bearer).subscribe(
      ((respuesta: any) =>{
         this.catalogoNacionalidad = respuesta;
         this.catalogosCargados += 1;
      })
    );
    this.infoClienteForm = this.formBuilder.group({
      tipoCliente:[this.cliente.getTipoCliente()],
      numId:[this.cliente.getNumId(), 
        [Validators.required,
        Validators.pattern(this.regex.validarSoloNumeros())]],
      autoridadEmiteId:[this.cliente.getAutoridadEmiteId(),
      [Validators.pattern(this.regex.validarNombre())]],
      ife:[this.cliente.getClaveElector(),
      [Validators.pattern(this.regex.validarClaveIne())]],
      curp: [this.cliente.getCurp(),
        [Validators.pattern(this.regex.validarCurp())]],
      rfc: [this.cliente.getRfc(),
        [Validators.pattern(this.regex.validarRfc())]],
      paterno: [this.cliente.getPaterno(), 
        [Validators.required,
          Validators.pattern(this.regex.validarNombre())]],
      materno: [this.cliente.getMaterno(), 
        [Validators.required,
          Validators.pattern(this.regex.validarNombre())]],
      nombre: [this.cliente.getNombre(), 
        [Validators.required,
          Validators.pattern(this.regex.validarNombre())]],
      nacimiento: [this.cliente.getNacimiento(), Validators.required],
      nacionalidad:[this.cliente.getNacionalidad()],
      sexo: [this.cliente.getSexo()=='Masculino'?'H':'M', Validators.required],
      edoCivil: [this.cliente.getEdoCivil(), Validators.required],
      actividad:["", 
        [Validators.required, Validators.pattern(this.regex.validarNombre())]],
      rangoSalarial:[this.cliente.getRangoSalarial()],
      actividadEmpresarial:[this.cliente.getActividadEmpresarial(), Validators.required],
      esNotifVencim:[this.cliente.getEsNotifVencim()],
      facebook:[this.cliente.getFacebook()],
      tipoDomic:[this.cliente.getTipoDomic()],
        calle:["", 
        [Validators.required,
        Validators.pattern(this.regex.validarNombre())]],
      numero:[this.cliente.getNumeroDomic(), 
        [Validators.required,
        Validators.pattern(this.regex.validarAlfanumericos())]],
      esBis:[this.cliente.getEsBis()],
      numInt:[this.cliente.getNumInt(), 
        [ Validators.pattern(this.regex.validarAlfanumericos())]],
      colonia:[this.cliente.getColonia(), 
        [Validators.required]],
      pais:[this.cliente.getPais()],
      esEmpleado:[this.cliente.getEsEmpleado()],
      estado:[this.cliente.getEstado()],
      ciudad:[this.cliente.getCiudad()]
    });
  }

  onChangeSelect(nombre: string, catalogo: CatalogoValuesOut[], $event)
  {
    console.log($event.detail.value)
    if($event.detail.value)
    {
      this.catalogoService.obtenerElementosCatalogoPorNombreDepConFilter2(nombre, this.bearer, $event.detail.value).subscribe(
        (respuesta: any) =>{
          console.log(respuesta);
          if(respuesta.code == -9999)
          {
            respuesta.data.forEach(elemento => {
            let elementoCat = new CatalogoValuesOut(elemento[0],elemento[1],"","",0);
            catalogo.push(elementoCat);
            });
            this.catalogosCargados += 1;
          }
          else
            catalogo = [];
        },
        (err: HttpErrorResponse)=>{
          console.log(err)
        });
    }
  }
  
  enviar(){
    // let emailConcat = "";
    // this.emails.forEach(element => {
    //   emailConcat += element+"|";
    // });
    this.cliente.setNombre(this.infoClienteForm.controls.nombre.value);
    this.cliente.setPaterno(this.infoClienteForm.controls.paterno.value);
    this.cliente.setMaterno(this.infoClienteForm.controls.materno.value);
    this.cliente.setAnioRegistro(this.cliente.getAnioRegistro());
    this.cliente.setEmision(this.cliente.getEmision());
    this.cliente.setClaveElector(this.cliente.getClaveElector());
    this.cliente.setOcr(this.cliente.getOcr());
    this.cliente.setVigencia(this.cliente.getVigencia());
    this.cliente.setNacimiento(this.infoClienteForm.controls.nacimiento.value);
    this.cliente.setSexo(this.infoClienteForm.controls.sexo.value);
    this.cliente.setPaisDeNacimiento(this.infoClienteForm.controls.pais.value);
    this.cliente.setTipoCliente(this.infoClienteForm.controls.tipoCliente.value);
    this.cliente.setTipoId(0);
    this.cliente.setNumId(this.infoClienteForm.controls.numId.value);
    this.cliente.setAutoridadEmiteId(this.infoClienteForm.controls.autoridadEmiteId.value);
    this.cliente.setNacionalidad(this.infoClienteForm.controls.nacionalidad.value);
    this.cliente.setEdoCivil(this.infoClienteForm.controls.edoCivil.value);
    this.cliente.setActividad(this.infoClienteForm.controls.actividad.value);
    this.cliente.setRangoSalarial(this.infoClienteForm.controls.rangoSalarial.value);
    this.cliente.setActividadEmpresarial(this.infoClienteForm.controls.actividadEmpresarial.value);
    this.cliente.setMail("");
    this.cliente.setEsNotifVencim(this.infoClienteForm.controls.esNotifVencim.value);
    this.cliente.setFacebook(this.infoClienteForm.controls.facebook.value);
    this.cliente.setEsRecibirNotific(false);
    this.cliente.setTipoDomic(this.infoClienteForm.controls.tipoDomic.value);
    this.cliente.setCalle(this.infoClienteForm.controls.calle.value);
    this.cliente.setNumeroDomic("");
    this.cliente.setEsBis(this.infoClienteForm.controls.esBis.value);
    this.cliente.setNumInt(this.infoClienteForm.controls.numInt.value);
    this.cliente.setColonia(this.infoClienteForm.controls.colonia.value);
    this.cliente.setPais(this.infoClienteForm.controls.pais.value);
    this.cliente.setEsEmpleado(this.infoClienteForm.controls.esEmpleado.value);
    this.cliente.setCiudad(this.infoClienteForm.controls.ciudad.value);
    this.cliente.setCodigoPostal("");
    this.cliente.setEstado(this.infoClienteForm.controls.estado.value);
    console.log(this.guardarS.getCliente());
    if(this.guardarS.getTipoFlujo() == 'alhajas')
      this.navCtrl.navigateRoot('firma-contrato');
    else
      this.navCtrl.navigateRoot('captura-domicilio');

    
  } 

  obtenerDatosCliente(cliente: Cliente){
    alert("Datos guardados");
          if(this.guardarS.getTipoFlujo()=='alhajas')
            this.navCtrl.navigateRoot('firma-contrato');
          else
            this.navCtrl.navigateRoot('captura-domicilio');
    // let jsonAddressArray: JsonAddress[]=[];
    // let jsonAddres = new JsonAddress(cliente.getCalle(),cliente.getNumeroDomic(),cliente.getNumInt(),cliente.getColonia(),cliente.getCiudad(),cliente.getPais(),cliente.getCodigoPostal(),cliente.getNumeroDomic(),+cliente.getColonia(),cliente.getEstado(),cliente.getTipoDomic(),"SAVE");
    // jsonAddressArray.push(jsonAddres);
    // jsonAddressArray.concat(cliente.getJsonAddress());
    // let jsonPersonalData = new JsonPersonalData(this.guardarS.getPersonId(),"",this.cliente.getPaterno(),cliente.getNombre(),cliente.getMaterno(),cliente.getSexo(),cliente.getNacimiento(),"es","",cliente.getPaisDeNacimiento(),cliente.getMail(),cliente.getTipoCliente().toString(),cliente.getEdoCivil().toString(),cliente.getOcr(), cliente.getRfc(), cliente.getCurp(),jsonAddressArray,"",cliente.getPhones());
    // let jsonInnerData = new JsonInnerData(jsonPersonalData);
    // let jsonInnerDataString = JSON.stringify(jsonInnerData);
    // let jsonData = new JsonData(1, "","FINALIZADO","1",jsonInnerDataString,this.secuenciaId,1,this.guardarS.getPersonId());
    // let jsonMetaData = new JsonMetadata(0,"",0,0,1,1);
    // let jsonDatosActivity = new JsonDatosActivity(jsonData,jsonMetaData, this.guardarS.getOperationID());
    // console.log(jsonDatosActivity);
    // this.activityService.actualizarDatosActivity(jsonDatosActivity, this.guardarS.getBearerToken()).subscribe(
    //   (resultado: any) => {
    //     if(resultado["code"] == -9999)
    //     {
    //       alert("Datos guardados");
    //       if(this.guardarS.getTipoFlujo()=='alhajas')
    //         this.navCtrl.navigateRoot('firma-contrato');
    //       else
    //         this.navCtrl.navigateRoot('captura-domicilio');
    //     }
    //     else
    //     {
    //       alert("Los datos no pueden ser guardados por el momento");
    //       // alert("Datos guardados.");
    //     }                      
    //   },
    //   (err:HttpErrorResponse)=>{
    //     console.log(err);
    //   });
    }

}
