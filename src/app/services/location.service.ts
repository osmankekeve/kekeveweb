import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { map, flatMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { LogService } from './log.service';
import {LocationModel} from '../models/location-model';
import {LocationMainModel} from '../models/location-main-model';

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  listCollection: AngularFirestoreCollection<LocationModel>;
  mainList$: Observable<LocationMainModel[]>;
  tableName = 'tblLocation';

  constructor(public authService: AuthenticationService, public logService: LogService, public db: AngularFirestore) {

  }

  async addItem(record: LocationMainModel) {
    await this.logService.sendToLog(record.data, 'insert', 'location');
    return await this.listCollection.add(record.data);
  }

  async removeItem(record: LocationMainModel) {
    /* this.db.firestore.runTransaction(t => {
        return t.get(sfDocRef).then(doc => {
          const newValue = doc.data().value;
        }).then().catch(err => console.error(err));
      }); */

    await this.logService.sendToLog(record.data, 'delete', 'location');
    return await this.db.collection(this.tableName).doc(record.data.primaryKey).delete();
  }

  async updateItem(record: LocationMainModel) {
    await this.logService.sendToLog(record.data, 'update', 'location');
    return await this.db.collection(this.tableName).doc(record.data.primaryKey).update(record.data);
  }

  async setItem(record: LocationMainModel, primaryKey: string) {
    await this.logService.sendToLog(record.data, 'insert', 'location');
    return await this.listCollection.doc(primaryKey).set(record.data);
  }

  checkFields(model: LocationModel): LocationModel {
    const cleanModel = this.clearSubModel();
    if (model.employeePrimaryKey === undefined) { model.employeePrimaryKey = '-1'; }
    if (model.customerPrimaryKey === undefined || model.customerPrimaryKey === '') { model.customerPrimaryKey = cleanModel.customerPrimaryKey; }
    if (model.name === undefined) { model.name = cleanModel.name; }
    if (model.longitude === undefined) { model.longitude = cleanModel.longitude; }
    if (model.latitude === undefined) { model.latitude = cleanModel.latitude; }
    if (model.country === undefined) { model.country = cleanModel.country; }
    if (model.city === undefined) { model.city = cleanModel.city; }
    if (model.district === undefined) { model.district = cleanModel.district; }
    if (model.address === undefined) { model.address = cleanModel.address; }
    if (model.description === undefined) { model.description = cleanModel.description; }
    if (model.insertDate === undefined) { model.insertDate = cleanModel.insertDate; }

    return model;
  }

  clearSubModel(): LocationModel {

    const returnData = new LocationModel();
    returnData.primaryKey = null;
    returnData.userPrimaryKey = this.authService.getUid();
    returnData.employeePrimaryKey = this.authService.getEid();
    returnData.customerPrimaryKey = '-1';
    returnData.name = '';
    returnData.longitude = 0;
    returnData.latitude = 0;
    returnData.country = '';
    returnData.city = '';
    returnData.district = '';
    returnData.address = '';
    returnData.description = '';
    returnData.insertDate = Date.now();

    return returnData;
  }
}
