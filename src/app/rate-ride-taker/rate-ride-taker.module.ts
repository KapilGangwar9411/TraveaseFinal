import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { RateRideTakerPageRoutingModule } from './rate-ride-taker-routing.module';

import { RateRideTakerPage } from './rate-ride-taker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RateRideTakerPageRoutingModule
  ],
  declarations: [RateRideTakerPage]
})
export class RateRideTakerPageModule {}
