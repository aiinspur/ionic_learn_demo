import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { DemoPage } from './demo';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { PhotoViewer } from '@ionic-native/photo-viewer';

import { Geolocation } from '@ionic-native/geolocation';



@NgModule({
  declarations: [
    DemoPage,
  ],
  imports: [
    IonicPageModule.forChild(DemoPage),
    TranslateModule.forChild()
  ],
  providers: [
    Camera,
    File,
    PhotoViewer,
    Geolocation
  ],
  exports: [
    DemoPage
  ]
})
export class DemoPageModule { }
