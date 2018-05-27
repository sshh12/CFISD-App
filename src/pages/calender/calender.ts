import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SchoolService } from '../../services/schools';
import { Globals } from '../../app/globals';

@Component({
  selector: 'page-calender',
  templateUrl: 'calender.html'
})
export class CalenderPage {

  calendermode: string;
  attendance: any;
  loading: boolean = false;
  currentGrades: any;

  constructor(public navCtrl: NavController,
              public events: Events,
              private storage: Storage,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private http: Http,
              public schoolServ: SchoolService) {

    this.calendermode = 'assignments';
    this.attendance = {};

    this.events.subscribe('calender:attendance', attend => {

      console.log(attend);

      if(attend.status == 'success') {

        this.storage.set('calender:attendance', attend);

        for(let month of attend.months) { // Create matrix for rendering calender

          let rows = [];
          let currentRow = [];

          for(let day in month.days) {

            let date = new Date(month.days[day].timestamp * 1000);
            let weekday = (date.getDay() + 1) % 7; // Inc date by one b/c of timezone offset

            if(weekday == 0 && currentRow.length > 0) {
              rows.push(currentRow);
              currentRow = [];
            } else if(weekday != 0){
              currentRow.push(day);
            }

          }

          while(rows[0] && rows[0].length < 6) rows[0].unshift("-1");

          month._rows = rows;

        }

        this.attendance = attend;

      }

      this.loading = false;

    });

    this.storage.get('calender:attendance').then((attend) => {
      if (attend) {
        this.events.publish('calender:attendance', attend);
      }
    });

    this.events.subscribe('grades:current', grades => {

      if (grades.status == 'success') {

        this.storage.set('grades:current', grades);

        this.currentGrades = grades;

        let today = Date.now();

        let assignCalender = [
          {name: 'Future', color: 'great', assignments: []},
          {name: 'Soon', color: 'ok', assignments: []},
          {name: 'Past', color: 'poor', assignments: []}
        ];

        for (let subject of grades.grades) {

          for(let assignment of subject.assignments) {

            assignment.subject = subject.name;

            let timeDiff = today.valueOf() - (new Date(assignment.datedue)).valueOf();

            if(timeDiff > 16 * 60 * 60 * 1000) {
              assignCalender[2].assignments.push(assignment); // Past
            } else if(timeDiff > -30 * 60 * 60 * 1000) {
              assignCalender[1].assignments.push(assignment); // Soon
            } else {
              assignCalender[0].assignments.push(assignment); // Future
            }

          }

        }

        assignCalender[0].assignments.sort((a, b) => {
          return (new Date(b.datedue)).getTime() - (new Date(a.datedue)).getTime();
        });

        assignCalender[1].assignments.sort((a, b) => {
          return (new Date(b.datedue)).getTime() - (new Date(a.datedue)).getTime();
        });

        assignCalender[2].assignments.sort((a, b) => {
          return (new Date(b.datedue)).getTime() - (new Date(a.datedue)).getTime();
        });

        this.currentGrades._assignCalender = assignCalender;

      }

      this.loading = false;

    });

    this.storage.get('grades:current').then((grades) => {
      if (grades) {
        this.events.publish('grades:current', grades);
      }
    });

  }

  refresh(refresher?) : void {
    if (refresher) {
      this.loadAttendance(() => refresher.complete());
    } else {
      this.loadAttendance();
    }
  }

  validCreds(sid: string, password: string): boolean {
    return password.length > 4 && sid.length == 7;
  }

  loadAttendance(callback?) : void {

    this.storage.get('grades:username').then((username) => {
      this.storage.get('grades:password').then((password) => {

        this.loading = true;

        if (!this.validCreds(username, password)) {
          this.toastCtrl.create({
            message: 'Invalid username or password',
            position: 'top',
            duration: 3000
          }).present();
          this.loading = false;
          if (callback) {
            callback();
          }
          return;
        }

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        username = username.toLowerCase(); // Sxxxxxx -> sxxxxxx

        this.http.post(Globals.SERVER + '/api/attendance/' + username, JSON.stringify({ password: password }), options).subscribe(data => {

          if (callback) {
            callback();
          }
          let json = data.json();
          json._updatedDate = new Date();
          this.events.publish('calender:attendance', json);

        },
          error => {
            this.loading = false;
            this.toastCtrl.create({
              message: 'A network error occured.',
              position: 'top',
              duration: 3000
            }).present();
            if (callback) {
              callback();
            }
          }
        );

      });
    });

  }

  getColor(day: any) : string {
    if(day.info) {
      for(let period in day.info){
        let text = day.info[period].toLowerCase();
        if(text.includes('no contact')) {
          return "bad";
        } else if(text.includes('testing')) {
          return "poor";
        }
      }
      return "ok";
    } else {
      return "none";
    }
  }

  showDayInfo(day: any) : void {

    if(day.info) {

      let date = new Date(day.timestamp * 1000 + 6 * 60 * 60);
      let msg = "";

      for(let period in day.info){
        let text = day.info[period];
        msg += `<b>${period}<b>: ${text}<br>`;
      }

      let alert = this.alertCtrl.create({
        title: date.toDateString(),
        message: msg,
        buttons: ['OK']
      });
      alert.present();

    } else {

      // No info to show...

    }
  }

  openBellSchedule() : void {
    window.open(this.schoolServ.school.bells);
  }

}
