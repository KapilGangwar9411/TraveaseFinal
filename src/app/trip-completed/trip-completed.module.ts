import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
    
import { IonicModule } from '@ionic/angular';

import { TripCompletedPageRoutingModule } from './trip-completed-routing.module';

import { TripCompletedPage } from './trip-completed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TripCompletedPageRoutingModule
  ],
  declarations: [TripCompletedPage]
})
export class TripCompletedPageModule {}
