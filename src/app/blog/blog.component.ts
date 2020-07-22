import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {InformationService} from '../services/information.service';
import {Router} from '@angular/router';
import {LogOnService} from '../services/log-on.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  searchText: '';

  constructor( public infoService: InformationService, public db: AngularFirestore, public route: Router,
               public logOnService: LogOnService) {
  }

  ngOnInit() {

  }

  async btnShowLogOn_Click(): Promise<void> {
    try {
      this.logOnService.showModal();
    } catch (e) {
      await this.infoService.error(e);
    }
  }

}
