import { Component } from '@angular/core';

import { SchoolService } from '../cfisd';

@Component({
  templateUrl: 'legal.page.html',
  styleUrls: ['grades.page.scss']
})
export class LegalPage {

  constructor(public schoolServ: SchoolService) {}

}
