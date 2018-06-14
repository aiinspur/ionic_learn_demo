import { NgModule } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ItemDetailPage } from './item-detail';

@NgModule({
  declarations: [
    ItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    ItemDetailPage
  ],
  providers: [
    Geolocation
  ]
})
export class ItemDetailPageModule { }
