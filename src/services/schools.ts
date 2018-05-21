import { Injectable } from '@angular/core';

@Injectable()
export class SchoolService {
  public school = {
    name: '',
    shortname: '',
    website: '',
    colorA: '',
    colorB: '',
    colorC: '',
    schooltype: ''
  };
}
