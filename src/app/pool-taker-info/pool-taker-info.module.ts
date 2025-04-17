import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { PoolTakerInfoPageRoutingModule } from './pool-taker-info-routing.module';

import { PoolTakerInfoPage } from './pool-taker-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PoolTakerInfoPageRoutingModule
  ],
  declarations: [PoolTakerInfoPage]
})
export class PoolTakerInfoPageModule {}
