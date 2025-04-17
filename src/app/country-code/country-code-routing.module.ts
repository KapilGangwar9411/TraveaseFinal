import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountryCodePage } from './country-code.page';

const routes: Routes = [
  {
    path: '',
    component: CountryCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountryCodePageRoutingModule {}
