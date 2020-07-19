import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthenticationService} from './authentication.service';
import {LogService} from './log.service';
import {ActivatedRoute, Router} from '@angular/router';
import {getEncryptionKey} from '../core/correct-library';
import * as CryptoJS from 'crypto-js';
import {RouterModel} from '../models/router-model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  encryptSecretKey: string = getEncryptionKey();

  constructor(public db: AngularFirestore, public authService: AuthenticationService, public route: Router,
              public logService: LogService, public router: ActivatedRoute) {

  }
}
