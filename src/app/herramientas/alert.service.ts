import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertCtrl: AlertController) { }

  async alertaSimple(header: string, message: string, textBtn: string, cssClass: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: textBtn,
          role: 'ok',
          cssClass,
          handler: (blah) => {
            // Action button cancel
            // console.log('Button negado');
          }
        }
      ]
    });
    await alert.present();
  
  }

  async alertaAction(header: string, message: string, css: string,  button: string, handler: ()=>void) {
    let buttonA = {
      text: button,
      cssClass: css,
      handler: handler
    };

    const alert = await this.alertCtrl.create({
      backdropDismiss: false,
      header: header,
      message: message,
      buttons: [buttonA]
    });

    await alert.present();
  }


}
