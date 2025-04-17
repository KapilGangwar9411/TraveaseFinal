import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountryCodePageRoutingModule } from './country-code-routing.module';

import { CountryCodePage } from './country-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountryCodePageRoutingModule
  ],
  declarations: [CountryCodePage]
})
export class CountryCodePageModule {}
