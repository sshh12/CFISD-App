import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SchoolService } from '../../services/schools';

@Component({
  selector: 'page-grades',
  templateUrl: 'grades.html'
})
export class GradesPage {

  constructor(public navCtrl: NavController, public schoolServ: SchoolService) {

  }

}
