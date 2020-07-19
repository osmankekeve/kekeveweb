import { Component, OnInit } from '@angular/core';
import {FileModel} from '../models/file-model';
import {FileUploadService} from '../services/file-upload.service';
import {FileMainModel} from '../models/file-main-model';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {
  constructor( public service: FileUploadService) { }
  mainList: Array<FileMainModel>;

  ngOnInit() {
    this.mainList = undefined;

    setTimeout (() => {
      if (this.mainList === undefined) {
        this.mainList = [];
      }
    }, 1000);
  }

}
