import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LogService } from './log.service';
import {getEducation, getGenders, getUserTypes} from '../core/correct-library';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(protected angularFireAuth: AngularFireAuth,
              protected db: AngularFirestore
  ) {
    this.angularFireAuth.authState.subscribe(userResponse => {
      if (userResponse) {
        sessionStorage.setItem('user', JSON.stringify(userResponse));
      } else {
        sessionStorage.setItem('user', null);
      }
    });
  }

  async login(email: string, password: string) {
    return await this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string) {
    return await this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  async sendEmailVerification() {
    return await this.angularFireAuth.auth.currentUser.sendEmailVerification();
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.angularFireAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout() {
    return await this.angularFireAuth.auth.signOut();
  }

  isUserLoggedIn() {
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user'));
    } else {
      return null;
    }
  }

  isEmployeeLoggedIn() {
    return JSON.parse(sessionStorage.getItem('employee'));
  }

  async loginWithGoogle() {
    return await this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  public getUid(): string {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return user.uid;
  }

  public getEid(): string {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return user.uid;
  }
}
