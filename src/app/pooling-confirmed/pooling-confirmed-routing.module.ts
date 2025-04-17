import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoolingConfirmedPage } from './pooling-confirmed.page';

const routes: Routes = [
  {
    path: '',
    component: PoolingConfirmedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolingConfirmedPageRoutingModule {}
