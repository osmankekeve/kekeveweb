import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { AlertComponent } from './partials/alert/alert.component';
import { NotificationComponent } from './notification/notification.component';
import { MailSenderComponent } from './mail-sender/mail-sender.component';
import { UploaderComponent } from './uploader/uploader.component';
import { GlobalUploadComponent } from './partials/global-upload/global-upload.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { BlogComponent } from './blog/blog.component';
import { ProjectComponent } from './project/project.component';
import { LogOnComponent } from './log-on/log-on.component';
import { ContactComponent } from './contact/contact.component';
import { ContactMailComponent } from './contact-mail/contact-mail.component';


const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'notification', component: NotificationComponent, pathMatch: 'full'},
  {path: 'mail-sender', component: MailSenderComponent, pathMatch: 'full'},
  {path: 'file-uploader', component: UploaderComponent, pathMatch: 'full'},
  {path: 'blog', component: BlogComponent, pathMatch: 'full'},
  {path: 'project', component: ProjectComponent, pathMatch: 'full'},
  {path: 'log-on', component: LogOnComponent, pathMatch: 'full'},
  {path: 'contact', component: ContactComponent, pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}// herzaman en sonda olmalı
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  PageNotFoundComponent, NavBarComponent, SideNavBarComponent, AlertComponent, DropzoneComponent, NotificationComponent,
  MailSenderComponent, GlobalUploadComponent, BlogComponent, ProjectComponent, LogOnComponent, ContactComponent, ContactMailComponent
];

// bunun sebebi her import edilen componenti app.module.ts e de yazmamız gerekli.
// Ancak burada impot ederek ve bunu app.module.
// ts te çağırarak dublicate importtan kurtulmuş oluruz. İşimizi sadece routing te bitirmiş oluruz
