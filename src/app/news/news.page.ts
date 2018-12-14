import { Component } from '@angular/core';

import {
  Platform,
  Events,
  AlertController,
  ToastController
} from '@ionic/angular';

import { SchoolService } from '../cfisd';
import { Globals } from '../globals';
import { Http } from '@angular/http';

@Component({
  selector: 'app-news',
  templateUrl: 'news.page.html',
  styleUrls: ['news.page.scss']
})
export class NewsPage {

  allNews = [];

  constructor(public events: Events,
              public toastCtrl: ToastController,
              private http: Http,
              public schoolServ: SchoolService) {

      this.events.subscribe('news:downloaded', news => {
        let articles = news.news.all;
        articles.sort((a, b) => {
          return (new Date(b.date)).getTime() - (new Date(a.date)).getTime();
        });
        this.allNews = articles;
      });

      this.events.subscribe('main:school', school => {
        this.allNews = [];
        this.loadNews();
      });

      this.loadNews();

  }

  async loadNews() {

    if(this.schoolServ.school.shortname == '') {
      return;
    }

    console.log(`${Globals.SERVER}/api/news/${this.schoolServ.school.shortname}/all`);

    try {

      let httpRequest = this.http.get(`${Globals.SERVER}/api/news/${this.schoolServ.school.shortname}/all`);
      let data = await httpRequest.toPromise();

      this.events.publish('news:downloaded', data.json());

    } catch(e) {

      let toast = await this.toastCtrl.create({
        message: 'Bad Connection 😔',
        position: 'top',
        duration: 3000
      });
      await toast.present();

    }

  }

  openArticle(article) {
    window.open(article.link, '_system');
  }

  async refresh(event) {
    await this.loadNews();
    event.target.complete();
  }

}
