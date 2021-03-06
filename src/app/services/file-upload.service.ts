import {Injectable} from '@angular/core';
import {storage} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireStorage} from '@angular/fire/storage';
import {FileUpload} from '../models/file-upload';
import {UploadTask} from '@angular/fire/storage/interfaces';
import {FileModel} from '../models/file-model';
import {LogService} from './log.service';
import {AngularFirestore, AngularFirestoreCollection, CollectionReference, Query} from '@angular/fire/firestore';
import {Observable, combineLatest} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {map, flatMap} from 'rxjs/operators';
import {currencyFormat, getFileIcons, getStatus} from '../core/correct-library';
import {FileMainModel} from '../models/file-main-model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  listCollection: AngularFirestoreCollection<FileModel>;
  mainList$: Observable<FileMainModel[]>;
  tableName = 'tblFiles';
  storageRef = storage().ref('files');

  constructor(public firebaseAuth: AngularFireAuth, public firebaseStorage: AngularFireStorage,
              public logService: LogService,
              public authService: AuthenticationService,
              public db: AngularFirestore) {
  }

  async addItem(record: FileMainModel) {
    return await this.listCollection.add(Object.assign({}, record.data));
  }

  async removeItem(record: FileMainModel) {
    this.storageRef.storage.ref(record.data.path).delete().then(() => {
      return this.db.collection(this.tableName).doc(record.data.primaryKey).delete();
    });
  }

  async updateItem(record: FileMainModel) {
    return await this.db.collection(this.tableName).doc(record.data.primaryKey).update(Object.assign({}, record.data));
  }

  async setItem(record: FileMainModel, primaryKey: string) {
    return await this.listCollection.doc(primaryKey).set(record);
  }

  clearSubModel(): FileModel {

    const returnData = new FileModel();
    returnData.primaryKey = null;
    returnData.userPrimaryKey = this.authService.getUid();
    returnData.parentPrimaryKey = '-1';
    returnData.parentType = '';
    returnData.fileName = '';
    returnData.downloadURL = '';
    returnData.path = '';
    returnData.size = 0;
    returnData.type = '';
    returnData.insertDate = Date.now();

    return returnData;
  }

  clearMainModel(): FileMainModel {
    const returnData = new FileMainModel();
    returnData.data = this.clearSubModel();
    returnData.actionType = 'added';
    return returnData;
  }

  checkFields(model: FileModel): FileModel {
    const cleanModel = this.clearSubModel();
    if (model.parentPrimaryKey === undefined) {
      model.parentPrimaryKey = cleanModel.parentPrimaryKey;
    }
    if (model.parentType === undefined) {
      model.parentType = cleanModel.parentType;
    }
    if (model.fileName === undefined) {
      model.fileName = cleanModel.fileName;
    }
    if (model.type === undefined) {
      model.type = cleanModel.type;
    }
    if (model.downloadURL === undefined) {
      model.downloadURL = cleanModel.downloadURL;
    }
    if (model.path === undefined) {
      model.path = cleanModel.path;
    }
    if (model.size === undefined) {
      model.size = cleanModel.size;
    }

    return model;
  }

  uploadFile(fileUpload: FileUpload, progress: { percentage: number }) {
    const fileName: string = fileUpload.name;

    const uploadTask: UploadTask = this.storageRef.child(fileName).put(fileUpload.file);
    uploadTask.on(storage.TaskEvent.STATE_CHANGED, (snapshot: storage.UploadTaskSnapshot) => {
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.ceil(snap.bytesTransferred / snap.totalBytes * 100);
      }, (error) => {
        return error;
      },
      () => {
        this.storageRef.child(fileName).getDownloadURL().then(p => {
            return p;
          }
        );
      });
  }

  uploadFileAsync = async (fileUpload: FileUpload, progress: { percentage: number }):
    Promise<any> => new Promise(async (resolve, reject): Promise<void> => {
    try {
      const fileName: string = fileUpload.name;

      const uploadTask: UploadTask = this.storageRef.child(fileName).put(fileUpload.file);
      uploadTask.on(storage.TaskEvent.STATE_CHANGED, (snapshot: storage.UploadTaskSnapshot) => {
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.ceil(snap.bytesTransferred / snap.totalBytes * 100);
      }, (error) => {
      }, () => {
      });
      resolve(uploadTask);

    } catch (error) {
      console.error(error);
      reject({code: 401, message: 'You do not have permission or there is a problem about permissions!'});
    }
  })

}
