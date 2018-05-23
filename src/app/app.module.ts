import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { NewsPage } from '../pages/news/news';
import { GradesPage } from '../pages/grades/grades';
import { AssignmentsPage } from '../pages/grades/grades';
import { CalculatorPage } from '../pages/grades/calculator';
import { LegalPage } from '../pages/grades/grades';
import { CalenderPage } from '../pages/calender/calender';
import { SitesPage } from '../pages/sites/sites';
import { TabsPage } from '../pages/tabs/tabs';

import { SchoolService } from '../services/schools';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    NewsPage,
    GradesPage,
    AssignmentsPage,
    CalculatorPage,
    LegalPage,
    CalenderPage,
    SitesPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NewsPage,
    GradesPage,
    AssignmentsPage,
    CalculatorPage,
    LegalPage,
    CalenderPage,
    SitesPage,
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
