import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { RideRoutePageRoutingModule } from './ride-route-routing.module';

import { RideRoutePage } from './ride-route.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RideRoutePageRoutingModule
  ],
  declarations: [RideRoutePage]
})
export class RideRoutePageModule {}
