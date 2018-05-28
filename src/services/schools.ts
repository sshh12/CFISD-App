import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Schools } from '../app/schools';

@Injectable()
export class SchoolService {
  public school = {
    name: '',
    shortname: '',
    website: '',
    faculty: '',
    bells: '',
    basicnews: '',
    colorA: '',
    colorB: '',
    colorC: '',
    schooltype: ''
  };
}

export function promptSchool(schoolServ: SchoolService, alertCtrl: AlertController, storage: Storage) : void {

  let alert = alertCtrl.create();
  alert.setTitle('School');

  for(let school of Schools) {

    alert.addInput({
        type: 'radio',
        label: school.name,
        value: school.name,
        checked: false
      });

  }

  alert.addButton({
    text: 'Go',
    handler: data => {

      for(let school of Schools) {

        if(school.name == data) {

          console.log(schoolServ.school);

          schoolServ.school = school;

          storage.set('main:school', school);
          storage.set('faculty:list', null);

          break;

        }

      }

    }
  });

  alert.present();

}
