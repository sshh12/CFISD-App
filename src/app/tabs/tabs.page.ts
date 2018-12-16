import { Component } from '@angular/core';

import { SchoolService } from '../cfisd';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public schoolServ: SchoolService) {}

}
