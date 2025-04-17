import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { RideAcceptedPageRoutingModule } from './ride-accepted-routing.module';

import { RideAcceptedPage } from './ride-accepted.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RideAcceptedPageRoutingModule
  ],
  declarations: [RideAcceptedPage]
})
export class RideAcceptedPageModule { }
