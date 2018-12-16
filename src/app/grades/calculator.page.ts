import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SchoolService } from '../cfisd';
import { SubjectReportCard } from './gradetypes';

@Component({
  templateUrl: 'calculator.page.html',
  styleUrls: ['grades.page.scss']
})
export class CalculatorPage {

  subject: SubjectReportCard = null;

  // state vars
  semester: string;
  firstweeks: any;
  secondweeks: any;
  exam: any;
  sem: any;
  exempt: boolean = false;
  orderOfOps: Array<string> = ['sem', 'exam', 'second', 'first'];;

  constructor(private route: ActivatedRoute, public schoolServ: SchoolService) {

    let now = new Date();
    this.semester = now.getMonth() < 7 ? 'spring':'fall';

    this.initCalc();

  }

  async initCalc() {

    this.route.queryParams.subscribe((params) => {
      this.subject = JSON.parse(params.reportcard);
      this.resetValues();
    });

  }

  clean(value: any) {
    let num: number = parseFloat(("0" + value).replace(/[^\d.-]/g, ''));
    num = Math.round(num * 100) / 100;
    return Math.min(num, 999);
  }

  cleanAllInputs() {
    this.firstweeks = this.clean(this.firstweeks);
    this.secondweeks = this.clean(this.secondweeks);
    this.exam = this.clean(this.exam);
    this.sem = this.clean(this.sem);
  }

  update(section: string) {

    // Updated order of inputs
    if(section != '') {
      this.orderOfOps.splice(this.orderOfOps.indexOf(section), 1);
      this.orderOfOps.push(section);
    }

    this.cleanAllInputs();

    // Choose appropriate calculation
    let lastOp = this.orderOfOps[0];
    if (lastOp == 'sem') {
      if (!this.exempt) {
        this.sem = ((this.firstweeks * 3 + this.secondweeks * 3) + this.exam) / 7;
      } else {
        this.sem = (this.firstweeks + this.secondweeks) / 2;
      }
    } else if (lastOp == 'exam') {
      if (!this.exempt) {
        this.exam = this.sem * 7 - (this.firstweeks * 3 + this.secondweeks * 3);
      } else {
        this.sem = ((this.firstweeks * 3 + this.secondweeks * 3) + this.exam) / 7;
      }
    } else if (lastOp == 'second') {
      if (!this.exempt) {
        this.secondweeks = (this.sem * 7 - this.exam - this.firstweeks * 3) / 3;
      } else {
        this.secondweeks = this.sem * 2 - this.firstweeks;
      }
    } else {
      if (!this.exempt) {
        this.firstweeks = (this.sem * 7 - this.exam - this.secondweeks * 3) / 3;
      } else {
        this.firstweeks = this.sem * 2 - this.secondweeks;
      }
    }

    this.cleanAllInputs();

  }

  resetValues() {
    if (this.semester == 'fall') {
      this.firstweeks = this.subject.averages[0].average;
      this.secondweeks = this.subject.averages[1].average;
      this.exam = this.subject.exams[0].average;
      this.sem = this.subject.semesters[0].average;
    } else {
      this.firstweeks = this.subject.averages[2].average;
      this.secondweeks = this.subject.averages[3].average;
      this.exam = this.subject.exams[1].average;
      this.sem = this.subject.semesters[1].average;
    }
    this.cleanAllInputs();
  }

}
