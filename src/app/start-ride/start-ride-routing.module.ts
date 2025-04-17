import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartRidePage } from './start-ride.page';

const routes: Routes = [
  {
    path: '',
    component: StartRidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartRidePageRoutingModule {}
