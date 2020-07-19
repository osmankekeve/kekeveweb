import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
import {LogModel} from './models/log-model';
import {LogService} from './services/log.service';
import {InformationService} from './services/information.service';
import {getBool, getFloat, getString, getTodayEnd, getTodayStart, getTomorrowEnd} from './core/correct-library';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {GlobalService} from './services/global.service';
import {RouterModel} from './models/router-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'KekeveWeb';

  constructor(
    private authService: AuthenticationService, private infoService: InformationService, private router: Router,
    private logService: LogService, private cookieService: CookieService, public globService: GlobalService
  ) {

  }

  ngOnInit() {

  }

}
