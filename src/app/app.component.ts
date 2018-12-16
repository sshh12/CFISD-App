import { Component } from '@angular/core';

import { Platform, Events, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { SchoolService, promptForSchool } from './cfisd';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    public events: Events,
    public alertCtrl: AlertController,
    public schoolServ: SchoolService
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(async () => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      let school = await this.storage.get('main:school');

      if(school) {
        this.schoolServ.school = school;
        this.events.publish('main:school', school);
        // this.initBannerAd();
      } else {
        await promptForSchool(this.schoolServ, this.alertCtrl, this.storage, this.events);
      }

    });
  }

}
