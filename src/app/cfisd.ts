import { Injectable } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { School, Schools } from './schools';

@Injectable()
export class SchoolService {
  public school: School = {
      name: 'None',
      shortname: '',
      website: '',
      faculty: '',
      bells: '',
      basicnews: '',
      colorA: '',
      colorB: '',
      colorC: '',
      schooltype: 'high',
      studentnews: null
  };
}

export async function promptForSchool(schoolServ: SchoolService,
                                      alertCtrl: AlertController,
                                      storage: Storage,
                                      events: Events) {

  async function setSchool(name: string) {
    for (let school of Schools) {
      if (school.name == name) {
        schoolServ.school = school;
        await storage.set('main:school', school);
        await storage.set('faculty:list', null);
        await events.publish('main:school', school);
        return;
      }
    }
  }

  let alertOptions = {
    header: 'School',
    inputs: [],
    buttons: [{
      text: 'Go',
      handler: data => {
        setSchool(data);
      }
    }]
  };

  for (let school of Schools) {

    alertOptions.inputs.push({
      type: 'radio',
      label: school.name,
      value: school.name,
      checked: false
    });

  }

  let alert = await alertCtrl.create(alertOptions);
  await alert.present();

}
