import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { environment } from 'src/environments/environment';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { InformationService } from './services/information.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { ExcelService } from './services/excel-service';
import { LogService } from './services/log.service';
import { AuthenticationService } from './services/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { DropzoneDirective } from './dropzone.directive';
import { UploaderComponent } from './uploader/uploader.component';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { GlobalUploadService } from './services/global-upload.service';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DropzoneComponent } from './dropzone/dropzone.component';

@NgModule({
    declarations: [
        AppComponent, routingComponents,
        NavBarComponent, SideNavBarComponent, DropzoneDirective, UploaderComponent, UploadTaskComponent, DropzoneComponent
    ],
  imports: [
    NgbModule, BrowserModule, FormsModule, AppRoutingModule, HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(), AngularFireStorageModule, AngularFontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCrmHBthGzNdcTXs74tFHy_dyXN6t-9uqM'
    })
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},
    InformationService, CookieService, LogService, AuthenticationService, ExcelService, GlobalUploadService, HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
