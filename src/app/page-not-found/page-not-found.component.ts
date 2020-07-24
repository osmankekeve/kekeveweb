import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  /*template: `
    <div class="notPage mt-5 mb-5 card">
      <h2>404</h2>
      <p>Aradığınız sayfa bulunamadı.<br><br>
    </div>
  `,*/
  template: `
    <div class="container dashboard-work-area">
      <div class="row">
        <div class="col-sm-2"></div>
        <div class="col-sm-8 text-center">
          <img alt="Kekeve System Developing" class="img-thumbnail main-logo mt-5" src="../../assets/images/maintenance.png">
          <h2 class="text-dark-gray mt-5">Sistem hazırlık aşamasındadır.</h2>
          <h4 class="text-dark-gray">En yeni sürüm ile yakında karşınızdayız.</h4>
          <h4 class="text-red">Angular 8 & Firebase Project 2020.</h4>
        </div>
        <div class="col-sm-2"></div>
      </div>
    </div>
  `,
  styles: []
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
