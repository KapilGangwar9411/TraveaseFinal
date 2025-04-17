import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoolTakersPage } from './pool-takers.page';

const routes: Routes = [
  {
    path: '',
    component: PoolTakersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolTakersPageRoutingModule {}
