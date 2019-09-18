import { Component } from '@angular/core';

import {
  ToastController,
  Events,
  AlertController
} from '@ionic/angular';

import { SchoolService, promptForSchool } from '../cfisd';
import { Storage } from '@ionic/storage';
import { Globals } from '../globals';
import { Http } from '@angular/http';

@Component({
  selector: 'app-sites',
  templateUrl: 'sites.page.html',
  styleUrls: ['sites.page.scss']
})
export class SitesPage {

  allTeachers: object = {};
  curTeachers: object = {};
  letters: Array<string> = [];
  showGeneral: boolean = true;

  constructor(public events: Events,
    public schoolServ: SchoolService,
    private storage: Storage,
    private http: Http,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {

    // Handle download of faculty info
    this.events.subscribe('faculty:downloaded', teachers => {
      this.storage.set('faculty:list', teachers);
      this.allTeachers = teachers;
      this.curTeachers = teachers;
    });

    this.events.subscribe('main:school', school => {
      this.loadTeachers();
    });

    this.initSites();

  }

  async initSites() {

    // [A, B, C, ..., Z]
    for (let i = 65; i <= 90; i++) {
      this.letters.push(String.fromCharCode(i));
    }

    // Try for cached teachers - if not found, download them
    let teachers = await this.storage.get('faculty:list');
    if (teachers) {
      console.log("Using cached teachers...");
      this.events.publish('faculty:downloaded', teachers);
    } else {
      this.loadTeachers();
    }

  }

  async loadTeachers() {

    if (!this.schoolServ.school.faculty) {
      return;
    }

    try {

      let httpRequest = this.http.get(`${Globals.SERVER}/api/faculty/list?url=${this.schoolServ.school.faculty}`);
      let data = await httpRequest.toPromise();
      this.events.publish('faculty:downloaded', data.json());

    } catch (e) {

      let toast = await this.toastCtrl.create({
        message: 'Couldn\'t find any teachers 😔',
        position: 'top',
        duration: 3000
      });
      await toast.present();

    }

  }

  openWebsite(url) {
    window.open(url, '_system');
  }

  emailTeacher(teacher) {
    window.open("mailto://" + teacher.email);
  }

  cleanWebsite(teacher) {
    return teacher.website.replace("https://", "")
      .replace("http://www.", "")
      .replace("/a/cfisd.net/", "/../");
  }

  onSearch(event: any) {

    // Ez Object Copy (current teachers is simply a filtered version of all teachers)
    this.curTeachers = JSON.parse(JSON.stringify(this.allTeachers));

    let term = event.target.value;

    // No query
    if (!term || term.length == 0) {
      this.showGeneral = true;
      return;
    }

    // Hide non-teacher stuff if the user is trying to find teachers
    this.showGeneral = false;

    for (let letter of this.letters) {
      if (this.curTeachers[letter] && term && term.trim() !== '') {
        this.curTeachers[letter] = this.curTeachers[letter].filter((teacher) => { // Filter only relevent teachers
          return teacher.name.toLowerCase().replace(' ', '').replace(',', '').includes(term.toLowerCase());
        });
      }
    }

  }

  onCancel() {
    this.curTeachers = this.allTeachers;
    this.showGeneral = true;
  }

  switchSchool() {
    promptForSchool(this.schoolServ, this.alertCtrl, this.storage, this.events);
  }

}
