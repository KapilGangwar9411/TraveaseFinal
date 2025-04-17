import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { StartRidePageRoutingModule } from './start-ride-routing.module';

import { StartRidePage } from './start-ride.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    StartRidePageRoutingModule
  ],
  declarations: [StartRidePage]
})
export class StartRidePageModule {}
