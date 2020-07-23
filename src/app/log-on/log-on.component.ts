import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {InformationService} from '../services/information.service';
import {Router} from '@angular/router';
import {LogOnService} from '../services/log-on.service';
import {AuthenticationService} from '../services/authentication.service';
import {UserService} from '../services/user.service';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-log-on',
  templateUrl: './log-on.component.html',
  styleUrls: ['./log-on.component.css']
})
export class LogOnComponent implements OnInit {
  isCMAChecked = false;
  logOnData = {
    email: '',
    password: ''
  };
  userDetails: any;
  employeeDetail: any;
  onTransaction = false;
  loginText = 'Oturum Aç';

  constructor(protected service: LogOnService, protected authService: AuthenticationService,  protected infoService: InformationService,
              protected userService: UserService, protected angularFireAuth: AngularFireAuth, protected route: Router) {
  }

  ngOnInit() {
  }

  async btnLogOn_Click(): Promise<void> {
    try {
      this.onTransaction = true;
      if (this.logOnData.email.trim() === '') {
        this.finishProcess('Lütfen mail adresi giriniz.', null);
      } else if (this.logOnData.password.trim() === '') {
        this.finishProcess('Lütfen şifre giriniz.', null);
      } else {
        this.loginText = 'Sistem Girişi Kontrol Ediliyor...';
        await this.authService.login(this.logOnData.email, this.logOnData.password)
          .then(res => {
            console.log(res);
            this.userDetails = this.authService.isUserLoggedIn();
            this.loginText = 'Sistem Girişi Başarılı';

            this.angularFireAuth.authState.subscribe(userResponse => {
              if (userResponse) {
                this.loginText = 'Sistem Bilgileri Doğrulanıyor..';
                sessionStorage.setItem('user', JSON.stringify(userResponse));
                this.loginText = 'Kullanıcı Girişi Kontrol Ediliyor...';
                this.userService.getItem(userResponse.uid, true)
                  .then((item) => {
                    this.loginText = 'Kullanıcı Girişi Başarılı';
                    this.employeeDetail = this.authService.isEmployeeLoggedIn();
                    this.loginText = 'Ana Sayfaya Yönlendiriliyor...';
                    this.route.navigate(['dashboard', {}]);
                    if (this.isCMAChecked) {
                      localStorage.setItem('cookieCMA', this.logOnData.email);
                    } else {
                      if (localStorage.getItem('cookieCMA') !== null) {
                        localStorage.removeItem('cookieCMA');
                      }
                    }
                    this.finishProcess(null, 'Mail adresi ve şifre doğrulandı');
                  });
              } else {
                sessionStorage.setItem('user', null);
              }
            });
          })
          .catch((error) => {
            this.infoService.error(error);
          });
      }
    } catch (error) {
      this.finishProcess(error, null);
    }
  }

  finishProcess(error: any, info: any): void {
    // error.message sistem hatası
    // error kontrol hatası
    if (error === null) {
      this.infoService.success(info !== null ? info : 'Belirtilmeyen Bilgi');
    } else {
      this.infoService.error(error.message !== undefined ? error.message : error);
    }
    this.onTransaction = false;
  }

}
