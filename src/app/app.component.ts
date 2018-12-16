import { Component } from '@angular/core';

import { Platform, Events, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { SchoolService, promptForSchool } from './cfisd';

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

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
    private admobFree: AdMobFree,
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
        this.initBannerAd();
      } else {
        await promptForSchool(this.schoolServ, this.alertCtrl, this.storage, this.events);
      }

    });
  }

  initBannerAd() : void {

    let bannerAdID: string;

    if(this.platform.is('android')) {
      bannerAdID = "ca-app-pub-9429036015049220/8918837970";
    } else if (this.platform.is('ios')) {
      bannerAdID = 'ca-app-pub-9429036015049220/5825770777';
    }

    const bannerConfig: AdMobFreeBannerConfig = {
      id: bannerAdID,
      isTesting: false, // REMOVE BEFORE FLIGHT
      autoShow: false
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare().then(() => {
      this.admobFree.banner.show();
    }).catch((e) => console.log(e));

  }

}
