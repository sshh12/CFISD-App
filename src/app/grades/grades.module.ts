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
    RouterModule.forChild([
      { 
        path: '', 
        component: GradesPage
      },
      { 
        path: 'legal', 
        loadChildren: './legal.module#LegalPageModule'
      },
      { 
        path: 'calculator', 
        loadChildren: './calculator.module#CalculatorPageModule'
      },
      { 
        path: 'assignments', 
        loadChildren: './assignments.module#AssignmentsPageModule'
      }
    ])
  ],
  declarations: [GradesPage]
})
export class GradesPageModule {}