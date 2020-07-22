import {Component, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GlobalUploadService} from '../../services/global-upload.service';
import {getEncryptionKey} from '../../core/correct-library';
import * as CryptoJS from 'crypto-js';
import {ActivatedRoute} from '@angular/router';
import {LogOnService} from '../../services/log-on.service';

@Component({
  selector: 'app-log-on',
  templateUrl: 'log-on.component.html'
})

export class LogOnComponent implements OnDestroy, OnInit {
  bytes: any;
  paramItem: any;
  model: any;
  subscription: Subscription | undefined;
  encryptSecretKey: string = getEncryptionKey();

  constructor(public service: LogOnService) {
  }

  ngOnInit(): void {
    this.subscription = this.service.get()
      .subscribe(async params => {
        if (params !== undefined && params) {
          setTimeout(() => {});
          // @ts-ignore
          $('#myModalLogOn').modal();

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
