import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';

import { SchoolService, promptSchool } from '../services/schools';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = TabsPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public events: Events,
              public alertCtrl: AlertController,
              private storage: Storage,
              public schoolServ: SchoolService) {

    platform.ready().then(() => {

      statusBar.styleDefault();

      this.storage.get('main:school').then((school) => {

        if(school) {
          schoolServ.school = school;
          events.publish('main:school', school)
        } else {
          promptSchool(schoolServ, alertCtrl, storage, events);
        }

        splashScreen.hide();

      });

    });

  }



}
