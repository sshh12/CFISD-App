import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SchoolService } from '../../services/schools';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {

  constructor(public navCtrl: NavController, public schoolServ: SchoolService) {

  }

}
