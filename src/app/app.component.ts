import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
import {LogService} from './services/log.service';
import {InformationService} from './services/information.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {GlobalService} from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userDetails: any;
  employeeDetail: any;

  title = 'KekeveWeb';

  constructor(
    private authService: AuthenticationService, private infoService: InformationService, private router: Router,
    private logService: LogService, private cookieService: CookieService, public globService: GlobalService
  ) {
    this.userDetails = this.authService.isUserLoggedIn();
    this.employeeDetail = this.authService.isEmployeeLoggedIn();

  }

  ngOnInit() {

  }

}
