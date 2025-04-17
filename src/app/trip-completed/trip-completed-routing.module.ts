import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripCompletedPage } from './trip-completed.page';

const routes: Routes = [
  {
    path: '',
    component: TripCompletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripCompletedPageRoutingModule {}
