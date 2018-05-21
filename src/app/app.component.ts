import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AlertController } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';

import { SchoolService } from '../services/schools';
import { Schools } from './schools';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = TabsPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public alertCtrl: AlertController,
              public schoolServ: SchoolService) {

    platform.ready().then(() => {

      this.promptSchool(schoolServ);

      statusBar.styleDefault();
      splashScreen.hide();

    });

  }

  promptSchool(schoolServ: SchoolService) : void {

    let alert = this.alertCtrl.create();
    alert.setTitle('School');

    for(let school of Schools) {

      alert.addInput({
          type: 'radio',
          label: school.name,
          value: school.name,
          checked: false
        });

    }

    alert.addButton({
      text: 'Go',
      handler: data => {
        for(let school of Schools) {
          if(school.name == data) {
            schoolServ.school = school;
            console.log(schoolServ.school);
            break;
          }
        }
      }
    });

    alert.present();

  }

}
