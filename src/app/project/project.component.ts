import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {InformationService} from '../services/information.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  searchText: '';

  constructor( public infoService: InformationService, public db: AngularFirestore, public route: Router) {
  }

  ngOnInit() {

  }

}
