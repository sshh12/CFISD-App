import { Component } from '@angular/core';

import { NewsPage } from '../../pages/news/news';
import { GradesPage } from '../../pages/grades/grades';
import { CalenderPage } from '../../pages/calender/calender';

import { SchoolService } from '../../services/schools';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = NewsPage;
  tab2Root = GradesPage;
  tab3Root = CalenderPage;

  constructor(public schoolServ: SchoolService) {

  }

}
