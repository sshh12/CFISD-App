export class AssignmentGrade {
  date: string;
  datedue: string;
  grade: string;
  gradetype: string;
  letter: string;
}

export class SubjectGrade {
  name: string;
  honors: boolean;
  letter: string;
  overallavg: string;
  assignments: AssignmentGrade[];
}

export class SubjectReportCard {
  name: string;
  exams: any[];
  averages: any[];
  semesters: any[];
  teacher: string;
  room: string;
}
