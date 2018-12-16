import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GradesPage } from './grades.page';
import { AssignmentsPage } from './assignments.page';
import { CalculatorPage } from './calculator.page';
import { LegalPage } from './legal.page';

import { AssignmentsPageModule } from './assignments.module';
import { CalculatorPageModule } from './calculator.module';
import { LegalPageModule } from './legal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AssignmentsPageModule,
    CalculatorPageModule,
    LegalPageModule,
    RouterModule.forChild([
      { path: '', component: GradesPage },
      { path: 'assignments', component: AssignmentsPage },
      { path: 'calculator', component: CalculatorPage },
      { path: 'legal', component: LegalPage }
    ])
  ],
  declarations: [GradesPage]
})
export class GradesPageModule {}
