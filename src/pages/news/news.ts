import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';

import { SchoolService } from '../../services/schools';
import { Globals } from '../../app/globals';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {

  allNews: any;

  constructor(public navCtrl: NavController,
              public events: Events,
              private http: Http,
              public toastCtrl: ToastController,
              public schoolServ: SchoolService) {

      this.allNews = [];

      this.events.subscribe('news:downloaded', news => {

        let articles = news.news.all;
        articles.sort((a, b) => {
          return (new Date(b.date)).getTime() - (new Date(a.date)).getTime();
        })
        this.allNews = articles;

        console.log(articles);

      });

      this.events.subscribe('main:school', school => {
        this.allNews = [];
        this.loadNews();
      });

      this.loadNews();

  }

  loadNews(callback?) {

    if(this.schoolServ.school.shortname == '') {
      return;
    }

    console.log(this.schoolServ.school, Globals.SERVER + '/api/news/' + this.schoolServ.school + '/all')

    this.http.get(Globals.SERVER + '/api/news/' + this.schoolServ.school.shortname + '/all').subscribe(
      data => {
        this.events.publish('news:downloaded', data.json());

        if (callback) {
          callback();
        }

      },
      error => {
        this.toastCtrl.create({
          message: 'Network error!',
          position: 'top',
          duration: 3000
        }).present();
      }
    );

  }

  openArticle(article) {
    window.open(article.link, '_system');
  }

  refresh(refresher) {
    this.loadNews(() => refresher.complete());
  }

}
