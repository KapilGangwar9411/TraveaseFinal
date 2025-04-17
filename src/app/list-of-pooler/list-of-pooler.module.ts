import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { ListOfPoolerPageRoutingModule } from './list-of-pooler-routing.module';

import { ListOfPoolerPage } from './list-of-pooler.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ListOfPoolerPageRoutingModule
  ],
  declarations: [ListOfPoolerPage]
})
export class ListOfPoolerPageModule { }
