import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, CollectionReference, Query} from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { map, flatMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import {getEducation, getGenders, getUserTypes} from '../core/correct-library';
import {UserModel} from '../models/user-model';
import {UserMainModel} from '../models/user-main-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  listCollection: AngularFirestoreCollection<UserModel>;
  mainList$: Observable<UserMainModel[]>;
  tableName = 'tblUsers';

  constructor(public authService: AuthenticationService, public db: AngularFirestore) {

  }

  async addItem(record: UserMainModel) {
    return await this.listCollection.add(Object.assign({}, record.data));
  }

  async removeItem(record: UserMainModel) {
    return await this.db.collection(this.tableName).doc(record.data.primaryKey).delete();
  }

  async updateItem(record: UserMainModel) {
    return await this.db.collection(this.tableName).doc(record.data.primaryKey).update(Object.assign({}, record.data));
  }

  checkForSave(record: UserMainModel): Promise<string> {
    return new Promise((resolve, reject) => {
      if (record.data.firstName.trim() === '') {
        reject('Lüfen ad giriniz.');
      } else if (record.data.lastName.trim() === '') {
        reject('Lüfen soyad giriniz.');
      } else if (record.data.mailAddress.trim() === '') {
        reject('Lüfen mail adresi giriniz.');
      } else {
        resolve(null);
      }
    });
  }

  checkForRemove(record: UserMainModel): Promise<string> {
    return new Promise(async (resolve, reject) => {
      resolve(null);
    });
  }

  checkFields(model: UserModel): UserModel {
    const cleanModel = this.clearUserModel();
    if (model.firstName === undefined) { model.firstName = cleanModel.firstName; }
    if (model.mailAddress === undefined) { model.mailAddress = cleanModel.mailAddress; }
    if (model.userType === undefined) { model.userType = cleanModel.userType; }
    if (model.isActive === undefined) { model.isActive = cleanModel.isActive; }
    if (model.pathOfProfilePicture === undefined) { model.pathOfProfilePicture = cleanModel.pathOfProfilePicture; }
    if (model.isActive === undefined) { model.isActive = cleanModel.isActive; }
    if (model.birthDate === undefined) { model.birthDate = cleanModel.birthDate; }

    return model;
  }

  clearUserModel(): UserModel {
    const returnData = new UserModel();
    returnData.primaryKey = null;
    returnData.firstName = '';
    returnData.lastName = '';
    returnData.mailAddress = '';
    returnData.userType = 'user';
    returnData.pathOfProfilePicture = '../../assets/images/users.png';
    returnData.isActive = true;
    returnData.birthDate = Date.now();

    return returnData;
  }

  clearUserMainModel(): UserMainModel {
    const returnData = new UserMainModel();
    returnData.data = this.clearUserModel();
    returnData.typeTr = getUserTypes().get(returnData.data.userType);
    returnData.actionType = 'added';
    returnData.isActiveTr = returnData.data.isActive === true ? 'Aktif' : 'Pasif';
    return returnData;
  }

  getItem(primaryKey: string, isSetToSession: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(this.tableName).doc(primaryKey).get()
        .toPromise()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data() as UserModel;
            data.primaryKey = doc.id;

            const returnData = this.clearUserMainModel();
            returnData.data = this.checkFields(data);
            returnData.typeTr = getUserTypes().get(returnData.data.userType);
            returnData.isActiveTr = returnData.data.isActive === true ? 'Aktif' : 'Pasif';
            if (isSetToSession) {sessionStorage.setItem('employee', JSON.stringify(returnData)); }
            resolve(Object.assign({returnData}));
          } else {
            resolve(null);
          }
      });
    });
  }

}
