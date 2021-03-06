import {Component, OnInit, OnDestroy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {InformationService} from '../services/information.service';
import {AuthenticationService} from '../services/authentication.service';
import emailjs, {EmailJSResponseStatus} from 'emailjs-com';
import {getFirstDayOfMonthForInput, getTodayForInput, isNullOrEmpty} from '../core/correct-library';
import {Router} from '@angular/router';
import {CONFIG} from 'src/mail.config';
import {MailService} from '../services/mail.service';
import {MailMainModel} from '../models/mail-main-model';

@Component({
  selector: 'app-mail-sender',
  templateUrl: './mail-sender.component.html',
  styleUrls: ['./mail-sender.component.css']
})
export class MailSenderComponent implements OnInit {
  mainList: Array<MailMainModel>;
  selectedRecord: MailMainModel;
  employeeDetail: any;
  userDetails: any;
  isMainFilterOpened = false;
  filterBeginDate: any;
  filterFinishDate: any;
  searchText: '';
  onTransaction = false;

  constructor(public authService: AuthenticationService, public service: MailService,
              public infoService: InformationService, public route: Router,
              public db: AngularFirestore) {
  }

  ngOnInit() {
    this.clearMainFiler();
    this.populateList();
    this.userDetails = this.authService.isUserLoggedIn();
    this.employeeDetail = this.authService.isEmployeeLoggedIn();
  }

  populateList(): void {
    this.mainList = undefined;
    const beginDate = new Date(this.filterBeginDate.year, this.filterBeginDate.month - 1, this.filterBeginDate.day, 0, 0, 0);
    const finishDate = new Date(this.filterFinishDate.year, this.filterFinishDate.month - 1, this.filterFinishDate.day + 1, 0, 0, 0);
    // removed populate list
    setTimeout(() => {
      if (this.mainList === undefined) {
        this.mainList = [];
      }
    }, 1000);
  }

  showSelectedRecord(record: any): void {
    this.selectedRecord = record as MailMainModel;
  }

  btnNew_Click(): void {
    this.clearSelectedRecord();
  }

  btnShowMainFiler_Click(): void {
    if (this.isMainFilterOpened === true) {
      this.isMainFilterOpened = false;
    } else {
      this.isMainFilterOpened = true;
    }
    this.clearMainFiler();
  }

  async btnSave_Click() {
    this.onTransaction = true;
    try {
      Promise.all([this.service.checkForSave(this.selectedRecord)])
        .then(async (values: any) => {
          if (this.selectedRecord.data.primaryKey === null) {
            const mailAddress = this.selectedRecord.data.mailTo.split(';');
            /*for (const item: string of mailAddress) {
              console.log(item);
            }*/
            if (this.selectedRecord.customerName.trim() === '') {this.selectedRecord.customerName = this.selectedRecord.data.mailTo;}
            const sendData = {
              receiverMailAddress: this.selectedRecord.data.mailTo,
              receiverName: this.selectedRecord.customerName,
              senderName: this.selectedRecord.employeeName,
              subject: this.selectedRecord.data.subject,
              content: this.selectedRecord.data.content
            };

            if (CONFIG.isSendMail) {
              emailjs.send(CONFIG.mjsServiceID, CONFIG.mjsMainTemplateID, sendData, CONFIG.mjsUserID)
                .then(async (result: EmailJSResponseStatus) => {
                  if (result.text === 'OK') {
                    this.selectedRecord.data.isSend = true;
                    this.selectedRecord.isSendTr = 'G??nderildi';
                  } else {
                    this.selectedRecord.data.isSend = false;
                    this.selectedRecord.isSendTr = 'G??nderilemedi';
                  }
                  this.selectedRecord.data.primaryKey = '';
                  await this.service.addItem(this.selectedRecord)
                    .then((item) => {
                      this.infoService.success('Mail ba??ar??yla g??nderildi.');
                      this.selectedRecord = undefined;
                    })
                    .catch((error) => {
                      this.finishProcess(error, null);
                    })
                    .finally(() => {
                      this.finishFinally();
                    });
                })
                .catch((error) => {
                  this.finishProcess(error, null);
                })
                .finally(() => {
                  this.finishFinally();
                });
            }
          }
        })
        .catch((error) => {
          this.finishProcess(error, null);
        });
    } catch (err) {
      this.infoService.error(err);
    }
  }

  async btnReturnList_Click(): Promise<void> {
    try {
      this.selectedRecord = undefined;
      await this.route.navigate(['mail-sender', {}]);
    } catch (err) {
      this.infoService.error(err);
    }
  }

  btnMainFilter_Click(): void {
    try {
      if (isNullOrEmpty(this.filterBeginDate)) {
        this.infoService.error('L??tfen ba??lang???? tarihi filtesinden tarih se??iniz.');
      } else if (isNullOrEmpty(this.filterFinishDate)) {
        this.infoService.error('L??tfen biti?? tarihi filtesinden tarih se??iniz.');
      } else {
        this.populateList();
      }
    } catch (err) {
      this.infoService.error(err);
    }
  }

  clearSelectedRecord(): void {
    this.selectedRecord = this.service.clearMainModel();
  }

  clearMainFiler(): void {
    this.filterBeginDate = getFirstDayOfMonthForInput();
    this.filterFinishDate = getTodayForInput();
  }

  finishProcess(error: any, info: any): void {
    // error.message sistem hatas??
    // error kontrol hatas??
    if (error === null) {
      this.infoService.success(info !== null ? info : 'Belirtilmeyen Bilgi');
      this.clearSelectedRecord();
      this.selectedRecord = undefined;
    } else {
      this.infoService.error(error.message !== undefined ? error.message : error);
    }
    this.onTransaction = false;
  }

  finishFinally(): void {
    this.clearSelectedRecord();
    this.selectedRecord = undefined;
    this.onTransaction = false;
  }
}
