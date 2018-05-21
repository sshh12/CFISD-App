import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { NewsPage } from '../pages/news/news';
import { GradesPage } from '../pages/grades/grades';
import { CalenderPage } from '../pages/calender/calender';
import { TabsPage } from '../pages/tabs/tabs';

import { SchoolService } from '../services/schools';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    NewsPage,
    GradesPage,
    CalenderPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NewsPage,
    GradesPage,
    CalenderPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SchoolService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
