import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { NewsPageModule } from '../news/news.module';
import { GradesPageModule } from '../grades/grades.module';
import { CalendarPageModule } from '../calendar/calendar.module';
import { SitesPageModule } from '../sites/sites.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    NewsPageModule,
    GradesPageModule,
    CalendarPageModule,
    SitesPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
