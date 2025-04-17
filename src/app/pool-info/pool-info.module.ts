import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { PoolInfoPageRoutingModule } from './pool-info-routing.module';

import { PoolInfoPage } from './pool-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PoolInfoPageRoutingModule
  ],
  declarations: [PoolInfoPage]
})
export class PoolInfoPageModule { }
