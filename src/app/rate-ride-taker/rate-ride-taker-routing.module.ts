import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RateRideTakerPage } from './rate-ride-taker.page';

const routes: Routes = [
  {
    path: '',
    component: RateRideTakerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RateRideTakerPageRoutingModule {}
