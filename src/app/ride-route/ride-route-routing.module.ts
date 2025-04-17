import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RideRoutePage } from './ride-route.page';

const routes: Routes = [
  {
    path: '',
    component: RideRoutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RideRoutePageRoutingModule {}
