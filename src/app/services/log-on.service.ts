import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class LogOnService {
  private readonly subject = new Subject<any>();

  constructor(router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.subject.next();
      }
    });
  }

  get(): Observable<any> {
    return this.subject.asObservable();
  }

  showModal(): void {
    this.openModal(true);
  }

  private openModal(isOpening: boolean): void {
    this.subject.next({isOpening});
  }
}
