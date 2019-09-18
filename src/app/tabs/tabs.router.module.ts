import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'news',
        loadChildren: '../news/news.module#NewsPageModule'
      },
      {
        path: 'grades',
        loadChildren: '../grades/grades.module#GradesPageModule'
      },
      {
        path: 'calendar',
        loadChildren: '../calendar/calendar.module#CalendarPageModule'
      },
      {
        path: 'sites',
        loadChildren: '../sites/sites.module#SitesPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/news',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
