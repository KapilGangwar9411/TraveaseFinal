import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoolTakerRequestPage } from './pool-taker-request.page';

const routes: Routes = [
  {
    path: '',
    component: PoolTakerRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolTakerRequestPageRoutingModule {}
