import { Component } from '@angular/core';

import { NewsPage } from '../../pages/news/news';
import { GradesPage } from '../../pages/grades/grades';
import { CalendarPage } from '../../pages/calendar/calendar';
import { SitesPage } from '../../pages/sites/sites';

import { SchoolService } from '../../services/schools';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = NewsPage;
  tab2Root = GradesPage;
  tab3Root = CalendarPage;
  tab4Root = SitesPage;

  constructor(public schoolServ: SchoolService) {

  }

}
