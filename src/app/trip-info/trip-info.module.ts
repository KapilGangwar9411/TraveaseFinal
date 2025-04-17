import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { TripInfoPageRoutingModule } from './trip-info-routing.module';

import { TripInfoPage } from './trip-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TripInfoPageRoutingModule
  ],
  declarations: [TripInfoPage]
})
export class TripInfoPageModule {}
