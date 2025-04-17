import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { PoolTakersPageRoutingModule } from './pool-takers-routing.module';

import { PoolTakersPage } from './pool-takers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PoolTakersPageRoutingModule
  ],
  declarations: [PoolTakersPage]
})
export class PoolTakersPageModule { }
