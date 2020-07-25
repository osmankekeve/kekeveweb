import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {InformationService} from '../services/information.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-contact-mail',
  templateUrl: './contact-mail.component.html',
  styleUrls: ['./contact-mail.component.css']
})
export class ContactMailComponent implements OnInit {
  lat: any;
  lng: any;

  constructor(public infoService: InformationService, public db: AngularFirestore, public route: Router) {
  }

  ngOnInit() {

  }

}
