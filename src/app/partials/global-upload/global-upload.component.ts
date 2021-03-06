import {Component, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GlobalUploadService} from '../../services/global-upload.service';
import {getEncryptionKey} from '../../core/correct-library';
import * as CryptoJS from 'crypto-js';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-global-upload',
  templateUrl: 'global-upload.component.html'
})

export class GlobalUploadComponent implements OnDestroy, OnInit {
  bytes: any;
  paramItem: any;
  model: any;
  subscription: Subscription | undefined;
  encryptSecretKey: string = getEncryptionKey();
  recordData = {
    primaryKey: '',
    moduleName: '',
    componentKey: '',
    recordName: ''
  };

  constructor(public service: GlobalUploadService) {
  }

  ngOnInit(): void {
    this.subscription = this.service.get()
      .subscribe(async params => {
        if (params !== undefined) {
          setTimeout(() => {});
          this.recordData.primaryKey = params.key;
          this.recordData.componentKey = params.component;
          if (params.keyModel) {
            this.bytes = await CryptoJS.AES.decrypt(params.keyModel, this.encryptSecretKey);
            this.paramItem = JSON.parse(this.bytes.toString(CryptoJS.enc.Utf8));
          }
          // @ts-ignore
          $('#myModalUpload').modal();

          const scrollToTop = window.setInterval(() => {
            const pos = window.pageYOffset;
            if (pos > 0) {
              window.scrollTo(0, pos - 60); // how far to scroll on each step
            } else {
              window.clearInterval(scrollToTop);
            }
          }, 16);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

}
