import { Component, OnInit } from '@angular/core';
import { MediaCapture,CaptureError,CaptureVideoOptions,MediaFile} from '@ionic-native/media-capture/ngx';
import { Storage } from '@ionic/storage';
//import {MediaFile } from '@ionic-native/video-capture-plus/ngx';
import { File } from '@ionic-native/file/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
const MEDIA_FILES_KEY = 'videoFiles';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  mediaFiles = [];
  myVideo: any;
  toast :any;
  constructor(private videoPlayer: VideoPlayer,private file: File,private mediaCapture: MediaCapture, private storage: Storage) {}
    ngOnInit() {
      this.storage.get(MEDIA_FILES_KEY).then(res => {
        this.mediaFiles = JSON.parse(res) || [];
      })
    }

    captureVideo() {
      let options: CaptureVideoOptions = {
        limit: 1,
        duration: 30
      }
      this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
        let capturedFile = res[0];
        let fileName = capturedFile.name;
        let dir = capturedFile['localURL'].split('/');
        dir.pop();
        let fromDirectory = dir.join('/');      
        var toDirectory = this.file.dataDirectory;
        
        this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
          this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
        },err => {
          console.log('err: ', err);
        });
            },
      (err: CaptureError) => console.error(err));
    }

    play(myFile) {
        //file:///android_asset/www/movie.mp4
        //file:///data/user/0/io.ionic.starter/files/VID_20191006_191834.mp4
        let path = this.file.dataDirectory + myFile.name;
        //let url = path.replace(/^file:\/\//, '');
        console.log(path);
        //let video = this.myVideo.nativeElement;
        //video.src = url;
        //video.play();
        this.videoPlayer.play(path).then(() => {
          console.log('video completed');
        }).catch(err => {
          console.log(err);
        });
      }
    
    storeMediaFiles(files) {
        this.storage.get(MEDIA_FILES_KEY).then(res => {
          if (res) {
            let arr = JSON.parse(res);
            arr = arr.concat(files);
            this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
          } else {
            this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
          }
          this.mediaFiles = this.mediaFiles.concat(files);
        })
      }

}