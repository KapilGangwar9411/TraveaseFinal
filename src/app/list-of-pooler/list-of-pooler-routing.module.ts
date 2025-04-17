import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListOfPoolerPage } from './list-of-pooler.page';

const routes: Routes = [
  {
    path: '',
    component: ListOfPoolerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListOfPoolerPageRoutingModule {}
