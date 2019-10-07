import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, ToastController} from '@ionic/angular'; 
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})




export class Tab3Page {

  unpairedDevices: any;
  pairedDevices: any;
  paired: boolean=false;
  prevPaired: string;
  pairStateList: { [key:string]:boolean; } = {};
  gettingDevices: Boolean;
  constructor(private bluetoothSerial: BluetoothSerial, private alertCtrl: AlertController) {
    bluetoothSerial.enable();
  }

  startScanning() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      this.unpairedDevices = success;
      this.gettingDevices = false;
      success.forEach(element => {
        this.pairStateList[element.name] = false;
        // alert(element.name);
      });
    },
      (err) => {
        console.log(err);
      })

    this.bluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
    },
      (err) => {

      })
  }
  success = (data) => {console.log("in success: ");
  this.paired = true;alert(data);   
  this.pairStateList[this.prevPaired] = true;
  
      }
  fail = (error) => alert(error);

  async selectDevice(device: any) {

    const alert = await this.alertCtrl.create({
      subHeader: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(device.address).subscribe(this.success, this.fail);
            console.log("in handler");
            this.prevPaired = device.name;
          }
        }
      ]
    });
    await alert.present();
    console.log("after success:",this.paired);
    
  }

  async disconnect() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
            this.paired = false;
            this.pairStateList[this.prevPaired] = false;
          }
        }
      ]
    });
    await alert.present();

  }

  async disableBT() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Turn Off?',
      message: 'Do you want to turn off Bluetooth?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Turn Off',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    await alert.present();
    
  }
}