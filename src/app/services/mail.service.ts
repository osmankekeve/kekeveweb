import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, CollectionReference, Query} from '@angular/fire/firestore';
import {Observable} from 'rxjs/Observable';
import {map, flatMap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {MailModel} from '../models/mail-model';
import {MailMainModel} from '../models/mail-main-model';
import {getCashDeskVoucherType, getMailParents, getString, isNullOrEmpty} from '../core/correct-library';
import {LogService} from './log.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  listCollection: AngularFirestoreCollection<MailModel>;
  mainList$: Observable<MailMainModel[]>;
  tableName = 'tblMail';
  employeeMap = new Map();
  mailParentList = getMailParents();

  constructor(public authService: AuthenticationService, public logService: LogService,
              public db: AngularFirestore) {
    
  }

  async addItem(record: MailMainModel) {
    await this.logService.sendToLog(record, 'insert', 'mail');
    return await this.listCollection.add(Object.assign({}, record.data));
  }

  async removeItem(record: MailMainModel) {
    return await this.db.collection(this.tableName).doc(record.data.primaryKey).delete();
  }

  async updateItem(record: MailMainModel) {
    await this.logService.sendToLog(record, 'update', 'mail');
    return await this.db.collection(this.tableName).doc(record.data.primaryKey).update(Object.assign({}, record.data));
  }

  checkForSave(record: MailMainModel): Promise<string> {
    return new Promise((resolve, reject) => {
      if (record.data.mailTo.trim() === '') {
        reject('Lütfen alıcı adresi giriniz.');
      } else if (record.data.subject.trim() === '') {
        reject('Lütfen başlık giriniz.');
      } else if (record.data.content.trim() === '') {
        reject('Lütfen içerik giriniz.');
      } else {
        resolve(null);
      }
    });
  }

  clearSubModel(): MailModel {

    const returnData = new MailModel();
    returnData.primaryKey = null;
    returnData.userPrimaryKey = this.authService.getUid();
    returnData.employeePrimaryKey = "-1";
    returnData.parentType = 'anyone';  // anyone, customer, employee
    returnData.parentPrimaryKey = '-1';  // customer, employee primaryKey
    returnData.mailTo = '';
    returnData.subject = '';
    returnData.content = '';
    returnData.html = '';
    returnData.isSend = true;
    returnData.insertDate = Date.now();

    return returnData;
  }

  clearMainModel(): MailMainModel {
    const returnData = new MailMainModel();
    returnData.data = this.clearSubModel();
    returnData.customerName = '';
    returnData.employeeName = this.employeeMap.get(returnData.data.employeePrimaryKey);
    returnData.parentTypeTr = this.mailParentList.get(returnData.data.parentType);
    returnData.actionType = 'added';
    returnData.isSendTr = returnData.data.isSend === true ? 'Gönderildi' : 'Gönderilmedi';
    return returnData;
  }

  getItem(primaryKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(this.tableName).doc(primaryKey).get().toPromise().then(doc => {
        if (doc.exists) {
          const data = doc.data() as MailModel;
          data.primaryKey = doc.id;

          const returnData = new MailMainModel();
          returnData.data = data;
          returnData.employeeName = this.employeeMap.get(getString(returnData.data.employeePrimaryKey));
          returnData.parentTypeTr = this.mailParentList.get(returnData.data.parentType);
          returnData.isSendTr = returnData.data.isSend === true ? 'Gönderildi' : 'Gönderilmedi';
          resolve(Object.assign({returnData}));

          resolve(Object.assign({data}));
        } else {
          resolve(null);
        }
      });
    });
  }

}
