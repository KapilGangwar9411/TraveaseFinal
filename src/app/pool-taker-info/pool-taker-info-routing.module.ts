import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoolTakerInfoPage } from './pool-taker-info.page';

const routes: Routes = [
  {
    path: '',
    component: PoolTakerInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolTakerInfoPageRoutingModule {}
