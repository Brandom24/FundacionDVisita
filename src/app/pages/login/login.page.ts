import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoginService } from '../../services/login.service';
import { GuardarStorageService } from '../../services/guardar-storage.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  trigger,  state,  style,  animate,  transition} from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('logo', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(150%)' }),
        animate('900ms 750ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }, ))
      ])
    ])
  ]
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  user = '';
  password = '';
  
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  estampaTiempo: string;  
  date = new Date();
  
  constructor(private navCtrl: NavController,
              private loginSrv: LoginService,
              private _store: GuardarStorageService,
              public fBuilder: FormBuilder) {
                this._store.limpiarStorageGeneral();
                this.loginSrv.generateToken();
                
                this.estampaTiempo = (this.date.toLocaleDateString('es-MX', this.options)).toUpperCase(); 
               }

  validation_messages = {
    user: [
      {type: 'required', message: 'Campos obligatorios'},
      {type: 'pattern', message: 'Caracteres no validos'}
    ],
    password: [
      {type: 'required', message: 'Campos obligatorios'},
      {type: 'minlength', message: 'Caracteres no validos'}
    ]
  };

  ngOnInit() {

    this.validations_form = this.fBuilder.group({
      user: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z-ÁÉÍÓÚñáéíóúÑ0-9]+[\\s]?([a-zA-Z-ÁÉÍÓÚñáéíóúÑ0-9]+[\\s]?)*')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ]))
    });

  }

  verifyUser() {
    this._store.limpiarStorage('recargar');
    this.loginSrv.verifyUser(this.validations_form.get('user').value, this.validations_form.get('password').value);
  }
  
}
