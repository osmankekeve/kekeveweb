import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {InformationService} from '../services/information.service';
import {Router} from '@angular/router';
import {LogOnService} from '../services/log-on.service';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  userDetails: any;
  searchText: '';

  constructor(private authService: AuthenticationService,  private infoService: InformationService, private db: AngularFirestore,
              private route: Router, private logOnService: LogOnService) {
  }

  ngOnInit() {
    this.userDetails = this.authService.isUserLoggedIn();
  }

  async btnShowLogOn_Click(): Promise<void> {
    try {
      await this.route.navigate(['log-on', {}]);
    } catch (e) {
      await this.infoService.error(e);
    }
  }

  async btnShowLogOff_Click(): Promise<void> {
    try {
      this.authService.logout()
        .then(res => {
          this.userDetails = undefined;
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('employee');
          sessionStorage.clear();
          this.infoService.success('Sistemden başarı ile çıkış yapıldı.');
        }, err => {
          this.infoService.error(err.message);
        });
    } catch (e) {
      await this.infoService.error(e);
    }
  }

}
