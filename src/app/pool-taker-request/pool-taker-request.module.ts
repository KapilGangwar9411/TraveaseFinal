import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { PoolTakerRequestPageRoutingModule } from './pool-taker-request-routing.module';

import { PoolTakerRequestPage } from './pool-taker-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PoolTakerRequestPageRoutingModule
  ],
  declarations: [PoolTakerRequestPage]
})
export class PoolTakerRequestPageModule { }
