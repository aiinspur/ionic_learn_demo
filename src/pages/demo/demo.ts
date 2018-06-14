import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, DateTime } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
// import { normalizeURL } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

declare var BMap: any;



/**
 * Generated class for the DemoPage page.
 */

@IonicPage()
@Component({
  selector: 'page-demo',
  templateUrl: 'demo.html',
})
export class DemoPage {
  // @ViewChild('fileInput') fileInput;

  // img_;
  fullImg;
  //大地坐标系
  geolocation_: any;
  //百度坐标系
  baiDuGeolocation;
  //当前位置
  curLocation;
  //位置详情
  locationDetails;
  locationDetailsViewOrNot: boolean = false;


  constructor(public navCtrl: NavController,
    public camera: Camera,
    public file: File,
    public platform: Platform,
    public geolocation: Geolocation,
    public actionSheetCtrl: ActionSheetController,
    public cdf: ChangeDetectorRef,
    public viewer: PhotoViewer,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DemoPage:');
    //this.fullImg = 'file:///storage/emulated/0/Android/data/io.ionic.starter/files/1528882717108';
    //获取用户位置信息
    this.getGeolocation();
  }


  forceCheck(self) {
    self.cdf.markForCheck();
    self.cdf.detectChanges();
  }

  geolocationTranslate(point) {
    var convertor = new BMap.Convertor();
    var pointArr = [];
    pointArr.push(point);
    var self = this;
    convertor.translate(pointArr, 1, 5, function (data) {
      var point = data.points[0];
      self.baiDuGeolocation = JSON.stringify(point);
      self.getLocation(point);
    })

  }


  getLocation(point) {
    var geoc = new BMap.Geocoder();
    var self = this;
    geoc.getLocation(point, function (rs) {
      alert(rs.address);
      self.curLocation = rs.address;
      self.locationDetails = JSON.stringify(rs);
      self.forceCheck(self);
    })
  }


  getGeolocation4(){
    this.locationDetailsViewOrNot = !this.locationDetailsViewOrNot;
  }

  getGeolocation() {
    var option: GeolocationOptions = { enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(option).then((resp) => {
      var point = new BMap.Point(resp.coords.longitude, resp.coords.latitude);
      this.geolocation_ = JSON.stringify({ "longitude": resp.coords.longitude, "latitude": resp.coords.latitude });
      //百度地图坐标转换.相关内容可参考:http://lbsyun.baidu.com/index.php?title=jspopular/guide/coorinfo
      this.geolocationTranslate(point);
    }).catch((error) => {
      alert('Error getting location:' + error.toString);
      console.log(error);
    });
  }


  open() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: '相机',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            console.log("用户选择了相机");
            this.getPicture(1);
          }
        },
        {
          text: ' 相册',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            console.log("用户选择了相册");
            this.getPicture(0);
          }
        }
      ]
    });
    actionSheet.present();
  }


  getPicture(sourceType) {
    console.log("in getPicture....");
    let options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: true,
      correctOrientation: true
      //allowEdit: true
      //mediaType: 2
    };

    if (Camera['installed']()) {
      this.camera.getPicture(options).then(imageData => {
        if (this.platform.is('ios')) {
          // this.img_ = normalizeURL(imageData);
        } else {
          // this.img_ = imageData;
        }
        this.watermark(imageData);
      }, error => {
        alert(JSON.stringify(error));
        console.log('ERROR -> ' + JSON.stringify(error));
      });
    } else {
      alert("请在手机上运行");
    }

  }

  show(fullImg) {
    this.viewer.show(fullImg, 'hello title');
    //file:///storage/emulated/0/Android/data/io.ionic.starter/files/1528882717108
  }

  watermark(base64Image) {
    var img = new Image();
    img.src = base64Image;
    var div = document.getElementById('imgViewDiv');
    img.onload = () => {
      var canvas = document.createElement('canvas');
      canvas.style.width = "50%";
      canvas.height = img.height;
      canvas.width = img.width;
      var cxt = canvas.getContext('2d');
      cxt.drawImage(img, 0, 0);
      var ftop = canvas.height - 20;
      var fleft = 10;
      cxt.fillStyle = "#ffffff";
      cxt.font = "100px Microsoft YaHei";
      cxt.fillText(this.curLocation, fleft, ftop);//文本元素在画布的位置
      div.appendChild(canvas);

      var dataUrl = canvas.toDataURL('image/jpeg');
      var imgBlob = this.dataURLToBlob(dataUrl);
      var fileName = (new Date).valueOf();
      var filePath = this.file.externalDataDirectory + fileName;
      var self = this;
      this.file.createFile(this.file.externalDataDirectory, fileName + "", true).then((res) => {
        res.createWriter(
          function (fileWriter) {
            fileWriter.onwriteend = function () {
              self.fullImg = filePath;
              self.cdf.markForCheck();
              self.cdf.detectChanges();
            };

            fileWriter.onerror = function (e) {
              alert("Failed file write: " + e.toString());
            }
            fileWriter.write(imgBlob);
          },
          function (e) {
            alert("error:" + JSON.stringify(e));
          });
      }).catch((e) => {
        alert(JSON.stringify(e));
      });
    }
  }

  do(base64Image) {
    var img = new Image();
    img.src = base64Image;
    alert(img.width + "," + img.height);
    var div = document.getElementById('imgViewDiv');
    img.onload = function () {
      alert(img.width + "," + img.height);
      var canvas = document.createElement('canvas');
      canvas.style.width = "100%";
      canvas.height = img.height;
      canvas.width = img.width;
      var cxt = canvas.getContext('2d');
      cxt.drawImage(img, 0, 0);
      var ftop = canvas.height - 20;
      var fleft = 10;
      cxt.fillStyle = "#ffffff";
      cxt.font = "100px Microsoft YaHei";
      cxt.fillText("北京仁聚汇通信息科技有限责任公司", fleft, ftop);//文本元素在画布的位置
      div.appendChild(canvas);
      alert("success:" + canvas.toDataURL);

    }
  }


  dataURLToBlob(dataurl) {
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}