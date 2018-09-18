import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';

import { SchoolService, promptSchool } from '../services/schools';

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = TabsPage;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events,
              public alertCtrl: AlertController,
              private storage: Storage,
              public schoolServ: SchoolService,
              private admobFree: AdMobFree) {

    platform.ready().then(() => {

      statusBar.styleDefault();

      this.storage.get('main:school').then((school) => {

        if(school) {
          schoolServ.school = school;
          events.publish('main:school', school)
          this.initBannerAd();
        } else {
          promptSchool(schoolServ, alertCtrl, storage, events);
        }

        splashScreen.hide();

      });

    });

  }

  /**
   * Initializes the banner ad on the bottom of the screen
   */
  initBannerAd() : void {

    let bannerAdID: string;

    if(this.platform.is('android')) { // Choose platform specific Admob ID
      bannerAdID = "ca-app-pub-9429036015049220/8918837970";
    } else if (this.platform.is('ios')) {
      bannerAdID = 'ca-app-pub-9429036015049220/5825770777';
    }

    const bannerConfig: AdMobFreeBannerConfig = {
      id: bannerAdID,
      isTesting: true, // REMOVE BEFORE FLIGHT
      autoShow: false
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare().then(() => {
      this.admobFree.banner.show();
    }).catch((e) => console.log(e));

  }

}
