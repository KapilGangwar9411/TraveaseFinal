import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { SelectLocationPageRoutingModule } from './select-location-routing.module';

import { SelectLocationPage } from './select-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SelectLocationPageRoutingModule
  ],
  declarations: [SelectLocationPage]
})
export class SelectLocationPageModule {}
