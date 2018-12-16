import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { NewsPage } from '../news/news.page';
import { GradesPage } from '../grades/grades.page';
import { CalendarPage } from '../calendar/calendar.page';
import { SitesPage } from '../sites/sites.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(news:news)',
        pathMatch: 'full',
      },
      {
        path: 'news',
        outlet: 'news',
        component: NewsPage
      },
      {
        path: 'grades',
        outlet: 'grades',
        component: GradesPage
      },
      {
        path: 'calendar',
        outlet: 'calendar',
        component: CalendarPage
      },
      {
        path: 'sites',
        outlet: 'sites',
        component: SitesPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(news:news)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
