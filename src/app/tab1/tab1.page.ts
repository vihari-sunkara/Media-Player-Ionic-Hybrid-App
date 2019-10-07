import { Component } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  recording: boolean = false;
  playing: boolean = false;
  filePath: string;
  fileName: string;
  hostname: string;
  replacer: string;
  audio: MediaObject;
  audioList: any[] = [];
  playStateList: { [key:string]:boolean; } = {};
  constructor(public navCtrl: NavController,
  private media: Media,
  private file: File,
  public platform: Platform, private alertCtrl: AlertController) {}

  getAudioList() {
  console.log("in getAudioList: ",localStorage.getItem("audiolist"));
  if(localStorage.getItem("audiolist")) {
    this.audioList = JSON.parse(localStorage.getItem("audiolist"));
    console.log(this.audioList);
  }
}
  ionViewWillEnter() {
  this.getAudioList();
}
  startRecord() {
  const win: any = window;
  this.hostname = win.location.host;
  console.log("win location here: ",this.hostname);
  if (this.platform.is('ios')) {
  	console.log("in ios");
    this.fileName = 'rec'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
    this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
    this.audio = this.media.create(this.filePath);
  } else if (this.platform.is('android')) {
    this.fileName = 'rec'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';

    console.log("this.file.externalDataDirectory: ",this.file.externalDataDirectory);
    this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
    console.log("this.filePath in startrecord: ",this.filePath);
    this.audio = this.media.create(this.filePath);
    
  }
  else{
  console.log("this object here: ",this)
  this.fileName = 'rec'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.mp3';
    /**this.filePath = this.file.dataDirectory.replace(/file:\/\//g, '') + this.fileName;**/
    this.filePath = this.file.dataDirectory + this.fileName;
    console.log("converting filePath: ",win.Ionic.WebView.convertFileSrc("file:///persistent/record2920192151.mp3"));
    console.log("filepath for audio storage: ",this.filePath);
    this.replacer = "http://"+this.hostname+'/home/_app_file_';
    this.filePath = this.filePath.replace("filesystem:file://",this.replacer);
    console.log("modified filepath: ",this.filePath);

    this.audio = this.media.create(this.filePath);
  }
  this.audio.startRecord();
  this.recording = true;
}

  stopRecord() {
  this.audio.stopRecord();
  console.log("filename: ",this.fileName);
  let data = { filename: this.fileName };
  this.audioList.push(data);
  localStorage.setItem("audiolist", JSON.stringify(this.audioList));
  this.recording = false;
  this.getAudioList();


  this.playStateList[this.fileName] = false;
}

  playAudio(file,idx) {
  if (this.platform.is('ios')) {
    this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
    this.audio = this.media.create(this.filePath);
    
  } else if (this.platform.is('android')) {
  console.log("file in play: ",file);
    this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
    console.log("filepath in play: ",this.filePath);
    this.audio = this.media.create(this.filePath);
    
  }
  else{
  	console.log("this.file.dataDirectory: ",this.file.dataDirectory);
  	this.filePath = this.file.dataDirectory + file;
    console.log("file param: ",file);
  	console.log("filepath in play: ",this.filePath);
     this.replacer = "http://"+this.hostname+'/home/_app_file_';
    this.filePath = this.filePath.replace("filesystem:file://",this.replacer);
  	/**console.log("after math: ",this.Ionic.WebView.convertFileSrc(this.filePath));**/
  	console.log("host details: ",this.hostname);
    this.audio = this.media.create(this.filePath);
  }
  this.audio.play();
  this.playStateList[file] = true;
  this.audio.setVolume(0.8);
}
pauseAudio(file,idx) {
  if (this.platform.is('ios')) {
    this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
    this.audio = this.media.create(this.filePath);
  } else if (this.platform.is('android')) {
  console.log("file in play: ",file);
    this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
    console.log("filepath in play: ",this.filePath);
    this.audio = this.media.create(this.filePath);
  }
  else{
    console.log("this.file.dataDirectory: ",this.file.dataDirectory);
    this.filePath = this.file.dataDirectory + file;
    console.log("file param: ",file);
    console.log("filepath in play: ",this.filePath);
     this.replacer = "http://"+this.hostname+'/home/_app_file_';
    this.filePath = this.filePath.replace("filesystem:file://",this.replacer);
    /**console.log("after math: ",this.Ionic.WebView.convertFileSrc(this.filePath));**/
    console.log("host details: ",this.hostname);
    this.audio = this.media.create(this.filePath);
  }
  this.audio.pause();
  this.playing = false;
  this.playStateList[file] = false;
}





  deleteAudio(fileNm, idx){
  let data = {filename: fileNm};
  console.log("json stringify in del: ",JSON.stringify(data));
  
  console.log("fileind in delete: ",idx);
  if (this.platform.is('ios')) {
    this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + fileNm;
    this.audioList.splice(idx, 1);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.getAudioList();
  } else if (this.platform.is('android')) {
    this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + fileNm;
    /**this.audio = this.media.create(this.filePath);**/
    console.log("fileName: ",fileNm);
    console.log("filePath: ",this.filePath);
    /**this.file.removeFile(this.filePath,fileName);**/
    this.audioList.splice(idx, 1);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.getAudioList();

  }
  this.playStateList[fileNm]=false;
  }
 async renameAudio(currFilename, idx) {
    console.log("string json: ",JSON.stringify(this.audioList));
    let newFileNm = ""
   
    //let currFileString = JSON.stringify(data);
    //console.log("currFileString in rename: ",currFileString);
    console.log("in rename currFilename: ",currFilename);
    
  console.log("ind: ",idx);

    const alert = await this.alertCtrl.create({
      subHeader: 'Rename',
      message: 'Enter New File name',
      inputs: [ 
        {
          name: 'newFileName',
          placeholder: 'New File name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Rename',
          handler: (data) => {
          newFileNm = data.newFileName;
          newFileNm = newFileNm + ".3gp";
         
            
          let newdata = {filename: newFileNm };
          this.audioList.splice(idx, 1, newdata);
          localStorage.setItem("audiolist", JSON.stringify(this.audioList));
          
          this.getAudioList();

          this.file.moveFile(this.file.externalDataDirectory, currFilename, this.file.externalDataDirectory, newFileNm);
          this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + newFileNm;
          


          }
        }
      ]
    });
    await alert.present();


  }

}
