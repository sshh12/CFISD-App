import { Component, ApplicationRef } from '@angular/core';
import { Events, AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { SchoolService } from '../cfisd';
import { Globals } from '../globals';
import { SubjectGrade, SubjectReportCard, AssignmentGrade } from './gradetypes';
import { getIcon, getColor, getColorRank, timeAgo } from './gradeutil';

@Component({
  selector: 'app-grades',
  templateUrl: 'grades.page.html',
  styleUrls: ['grades.page.scss']
})
export class GradesPage {

  // page
  gradeType: string = 'current';
  loading: boolean = false;

  // state
  currentGrades: SubjectGrade[] = [];
  reportCardGrades: SubjectReportCard[] = [];
  transcript: any = {};
  gpa: number = 0;
  percentile: number = 0;
  lastUpdated: Date;

  // bind to this
  getIcon = getIcon;
  getColor = getColor;
  getColorRank = getColorRank;
  timeAgo = timeAgo;

  constructor(public events: Events,
    private ref: ApplicationRef,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private http: Http,
    private storage: Storage,
    public router: Router,
    public schoolServ: SchoolService) {

    this.events.subscribe('grades:current', this.onCurrentGrades.bind(this));
    this.events.subscribe('grades:reportcard', this.onReportCard.bind(this));
    this.events.subscribe('grades:transcript', this.onTranscript.bind(this));

    this.initGrades();

  }

  async initGrades() {

    let grades = await this.storage.get('grades:current');
    if (grades) {
      this.events.publish('grades:current', grades);
    }

    let reportcard = await this.storage.get('grades:reportcard');
    if (reportcard) {
      this.events.publish('grades:reportcard', reportcard);
    }

    let transcript = await this.storage.get('grades:transcript');
    if (transcript) {
      this.events.publish('grades:transcript', transcript);
    }

  }

  onCurrentGrades(grades) {

    if (grades.status == 'success') {

      this.lastUpdated = grades._updatedDate;

      this.currentGrades = [];

      this.storage.set('grades:current', grades);

      let current: SubjectGrade[] = grades.grades;

      for (let subject of current) {

        // Sort by date and assign
        let grades: AssignmentGrade[] = subject.assignments;
        grades.sort((a: AssignmentGrade, b: AssignmentGrade) => {
          return (new Date(b.datedue)).getTime() - (new Date(a.datedue)).getTime();
        })
        subject.assignments = grades;

      }

      this.currentGrades = current;

    } else {
      this.showServerDialog(grades.status);
    }

    this.loading = false;
    this.ref.tick();

  }

  onReportCard(reportcard) {

    if (reportcard.status == 'success') {
      this.storage.set('grades:reportcard', reportcard);
      this.reportCardGrades = reportcard.reportcard;
    } else {
      this.showServerDialog(reportcard.status);
    }

    this.loading = false;
    this.ref.tick();

  }

  onTranscript(transcript) {

    if (transcript.status == 'success') {
      this.storage.set('grades:transcript', transcript);
      this.gpa = transcript.gpa.value;
      this.percentile = Math.ceil(transcript.gpa.rank / transcript.gpa.class_size * 100);
      this.transcript = transcript;
    } else {
      this.showServerDialog(transcript.status);
    }

    this.loading = false;
    this.ref.tick();

  }

  showServerDialog(status: string) {

    let showToast = async (msg) => {
      let toast = await this.toastCtrl.create({
        message: msg,
        position: 'top',
        duration: 3000
      });
      await toast.present();
    }

    if (status == 'login_failed') {
      showToast('Your login didn\'t work 😔');
    } else if (status == 'connection_failed') {
      showToast('Unable to connect to HomeAccessCenter 😔');
    } else if (status == 'server_error') {
      showToast('Something\'s wrong with the server 😔');
    } else {
      showToast('Oops something\'s wrong... 😔');
    }

  }

  async loadGrades(gradeType: string) {

    let username = await this.storage.get('grades:username');
    let password = await this.storage.get('grades:password');

    if (!this.validCreds(username, password)) {
      let toast = await this.toastCtrl.create({
        message: 'Invalid username or password 😕',
        position: 'top',
        duration: 3000
      });
      await toast.present();
      this.loading = false;
      return;
    }

    username = username.toLowerCase(); // must be lowercase

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    try {

      this.loading = true;

      let httpRequest = this.http.post(`${Globals.SERVER}/api/${gradeType}/${username}`, JSON.stringify({ password: password }), options);
      let data = await httpRequest.toPromise();

      let json = data.json();
      json._updatedDate = new Date();
      this.events.publish(`grades:${gradeType}`, json);

    } catch (e) {

      this.loading = false;
      let toast = await this.toastCtrl.create({
        message: 'Unable to connect 😔',
        position: 'top',
        duration: 3000
      });
      await toast.present();

    }

  }

  validCreds(sid: string, password: string): boolean {
    return sid && password && password.length > 4 && sid.length > 4;
  }

  async showLogin(fab) {

    fab.close();

    let handleGo = async (data) => {

      let accepted = await this.storage.get('grades:legal');

      if (accepted) {
        await this.storage.set('grades:username', data.sid);
        await this.storage.set('grades:password', data.password);
        this.loadGrades('current');
        this.loadGrades('reportcard');
        this.loadGrades('transcript');
      } else {
        this.showConfirmLegal(data.sid, data.password);
      }

    };

    let prompt = await this.alertCtrl.create({
      header: 'Login',
      inputs: [
        {
          name: 'sid',
          placeholder: 's000000'
        }, {
          name: 'password',
          placeholder: 'password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Go',
          handler: handleGo
        }
      ]
    });
    await prompt.present();

  }

  async showConfirmLegal(username, password) {

    let handleNo = async () => {
      await this.storage.set('grades:legal', false);
      let toast = await this.toastCtrl.create({
        message: 'Cannot get grades 😔',
        position: 'top',
        duration: 3000
      });
      await toast.present();
    };

    let handleYes = async () => {
      await this.storage.set('grades:legal', true);
      await this.storage.set('grades:username', username);
      await this.storage.set('grades:password', password);
      this.loadGrades('current');
      this.loadGrades('reportcard');
      this.loadGrades('transcript');
    };

    let confirm = await this.alertCtrl.create({
      header: 'Legal',
      message: 'For future features and data analysis, the app requires that you accept the policies outlined in the legal section of the app (black icon in the top right menu) and confirm that you are more than 14 years old.',
      buttons: [
        {
          text: 'No!',
          handler: handleNo
        },
        {
          text: 'Yup (I accept)',
          handler: handleYes
        }
      ]
    });
    await confirm.present();

  }

  logout(fab) {

    fab.close();

    this.storage.set('grades:username', '');
    this.storage.set('grades:password', '');
    this.storage.set('grades:legal', false);
    this.storage.set('grades:current', {});
    this.storage.set('grades:reportcard', {});
    this.storage.set('grades:transcript', {});

    this.currentGrades = [];
    this.reportCardGrades = [];
    this.gpa = -1;
    this.percentile = -1;
    this.transcript = {};
    this.loading = false;

  }

  async refresh(event?) {

    if (this.loading) return; // dont refresh if still loading

    await this.storage.set('grades:legal', false);
    let toast = await this.toastCtrl.create({
      message: '☁️ Downloading...',
      position: 'top',
      duration: 1500
    });
    toast.present();

    await this.loadGrades(this.gradeType);

    if (event) event.target.complete();

  }

  fixPercent(percent: string): string {
    if (!percent || percent == '' || percent == '0') {
      return '-';
    }
    return percent;
  }

  openLegal(event) {
    this.router.navigate(['/legal'], {});
  }

  openClassGrades(subject: SubjectGrade) {
    this.router.navigate(['/assignments'], {
      queryParams: {
        subject: JSON.stringify(subject)
      }
    });
  }

  async calculate() {

    let handleGo = (data) => {
      let reportcard: SubjectReportCard;
      for (let subject of this.reportCardGrades) {
        if (subject.name == data) {
          reportcard = subject;
          break;
        }
      }
      this.router.navigate(['/calculator'], {
        queryParams: {
          reportcard: JSON.stringify(reportcard)
        }
      });
    };

    let alertOptions = {
      header: 'Which Class?',
      inputs: [],
      buttons: [
        { text: 'Cancel' },
        { text: 'Go', handler: handleGo }
      ]
    };

    let first: boolean = true;
    for (let subject of this.reportCardGrades) {
      alertOptions.inputs.push({
        type: 'radio',
        label: subject.name,
        value: subject.name,
        checked: first
      });
      first = false;
    }

    let alert = await this.alertCtrl.create(alertOptions);
    await alert.present();

  }

}
