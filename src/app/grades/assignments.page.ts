import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SchoolService } from '../cfisd';
import { SubjectGrade } from './gradetypes';
import { getColor, timeAgo } from './gradeutil';

@Component({
  templateUrl: 'assignments.page.html',
  styleUrls: ['grades.page.scss']
})
export class AssignmentsPage {

  subject: SubjectGrade = null;

  // bind to this
  getColor = getColor;
  timeAgo = timeAgo;

  constructor(private route: ActivatedRoute, public schoolServ: SchoolService) {

    this.initAssignments();

  }

  async initAssignments() {

    this.route.queryParams.subscribe((params) => {
      try {
        this.subject = JSON.parse(params.subject);
      } catch (e) {}
    });

  }

}
