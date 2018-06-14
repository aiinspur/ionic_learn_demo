import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  coords: any;
  lat;
  lon;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    private geolocation: Geolocation,
    items: Items) {
    this.item = navParams.get('item') || items.defaultItem;
    this.getGeolocation();
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("resp.coords:%s", JSON.stringify(resp));
      this.lat = resp.coords.latitude;
      this.lon = resp.coords.longitude;
    }).catch((error) => {
      console.log(error);
      this.coords = error;
    });

  }

}
