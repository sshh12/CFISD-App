import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradesPage } from './grades.page';
import { LegalPage } from './legal.page';

import { LegalPageModule } from './legal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LegalPageModule,
    RouterModule.forChild([
      { path: '', component: GradesPage },
      { path: 'legal', component: LegalPage }
    ])
  ],
  declarations: [GradesPage]
})
export class GradesPageModule {}
