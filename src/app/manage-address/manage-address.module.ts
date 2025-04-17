import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
 
import { IonicModule } from '@ionic/angular';

import { ManageAddressPageRoutingModule } from './manage-address-routing.module';

import { ManageAddressPage } from './manage-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ManageAddressPageRoutingModule
  ],
  declarations: [ManageAddressPage]
})
export class ManageAddressPageModule {}
