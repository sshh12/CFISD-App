import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SchoolService } from '../../services/schools';

@Component({
  selector: 'page-calender',
  templateUrl: 'calender.html'
})
export class CalenderPage {

  constructor(public navCtrl: NavController, public schoolServ: SchoolService) {

  }

}
