import { Component } from '@angular/core';
import { Events, AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { SchoolService } from '../cfisd';
import { Globals } from '../globals';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss']
})
export class CalendarPage {

  calendarmode: string = 'assignments';
  attendance: any = {};
  currentGrades: any = [];
  loading: boolean = false;

  constructor(public events: Events,
              private storage: Storage,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private http: Http,
              public schoolServ: SchoolService) {

    this.events.subscribe('calendar:attendance', this.onAttendance.bind(this));
    this.events.subscribe('grades:current', this.onCurrentGrades.bind(this));

    this.initCalendar();

  }

  async initCalendar() {

    let attend = await this.storage.get('calendar:attendance');
    if(attend) {
      this.events.publish('calendar:attendance', attend);
    }

    let grades = await this.storage.get('grades:current');
    if(grades) {
      this.onCurrentGrades(grades);
    }

  }

  onAttendance(attend) {

    console.log(attend);

    if(attend.status == 'success') {

      this.storage.set('calendar:attendance', attend);

      for(let month of attend.months) { // Create matrix for rendering calendar

        let rows = [];
        let currentRow = [];

        for(let day in month.days) {

          let date = new Date(month.days[day].timestamp * 1000);
          date.setHours(11); // normalize just in case weird times
          let weekday = (date.getDay() + 1) % 7; // Inc date by one b/c of timezone offset

          if(weekday == 0 && currentRow.length > 0) {
            rows.push(currentRow);
            currentRow = [];
          } else if(weekday != 0){
            currentRow.push(day);
          }

        }

        if(currentRow.length > 0) {
          while(currentRow.length < 6) currentRow.push("-1");
          rows.push(currentRow);
        }

        while(rows[0] && rows[0].length < 6) rows[0].unshift("-1");

        month._rows = rows;

      }

      this.attendance = attend;

    }

    this.loading = false;

  }

  onCurrentGrades(grades) {

    if (grades.status == 'success') {

      this.storage.set('grades:current', grades);

      this.currentGrades = grades;

      let today = Date.now();

      let assignCalendar = [
        {name: 'Future', color: 'great', assignments: []},
        {name: 'Soon', color: 'ok', assignments: []},
        {name: 'Past', color: 'poor', assignments: []}
      ];

      for (let subject of grades.grades) {

        for(let assignment of subject.assignments) {

          assignment.subject = subject.name;

          let timeDiff = today.valueOf() - (new Date(assignment.datedue)).valueOf();

          if(timeDiff > 16 * 60 * 60 * 1000) {
            assignCalendar[2].assignments.push(assignment); // Past
          } else if(timeDiff > -30 * 60 * 60 * 1000) {
            assignCalendar[1].assignments.push(assignment); // Soon
          } else {
            assignCalendar[0].assignments.push(assignment); // Future
          }

        }

      }

      assignCalendar[0].assignments.sort((a, b) => {
        return (new Date(b.datedue)).getTime() - (new Date(a.datedue)).getTime();
      });

      assignCalendar[1].assignments.sort((a, b) => {
        return (new Date(b.datedue)).getTime() - (new Date(a.datedue)).getTime();
      });

      assignCalendar[2].assignments.sort((a, b) => {
        return (new Date(b.datedue)).getTime() - (new Date(a.datedue)).getTime();
      });

      this.currentGrades._assignCalendar = assignCalendar;

    }

    this.loading = false;

  }

  validCreds(sid: string, password: string): boolean {
    return sid && password && password.length > 4 && sid.length > 4;
  }

  async loadAttendance() {

    let username = await this.storage.get('grades:username');
    let password = await this.storage.get('grades:password');

    if (!this.validCreds(username, password)) {
      let toast = await this.toastCtrl.create({
        message: 'Invalid username or password',
        position: 'top',
        duration: 3000
      });
      await toast.present();
      this.loading = false;
      return;
    }

    this.loading = true;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    username = username.toLowerCase();

    try {

      let httpRequest = this.http.post(`${Globals.SERVER}/api/attendance/${username}`, JSON.stringify({ password: password }), options);
      let data = await httpRequest.toPromise();

      let json = data.json();
      json._updatedDate = new Date();
      this.events.publish('calendar:attendance', json);

    } catch(e) {

      this.loading = false;
      let toast = await this.toastCtrl.create({
        message: 'Unable to connect 😔',
        position: 'top',
        duration: 3000
      });
      await toast.present();

    }

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

  async showDayInfo(day: any) {

    if(day.info) {

      // weird time offset, so adding to align w/calender
      let date = new Date(day.timestamp * 1000 + 6 * 60 * 60 * 1000);
      let msg = "";

      for(let period in day.info){
        let text = day.info[period];
        msg += `<b>${period}<b>: ${text}<br>`;
      }

      let alert = await this.alertCtrl.create({
        header: date.toDateString(),
        message: msg,
        buttons: ['OK']
      });
      await alert.present();

    }

  }

  async refresh() {
    if(this.loading) return;
    await this.loadAttendance();
  }

  openBellSchedule() {
    window.open(this.schoolServ.school.bells);
  }

}
