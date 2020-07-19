import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import {getDateForExcel, getBoolStr, getTransactionTypes, getRelationTypes} from '../core/correct-library';
import {ExcelConfig} from 'src/excel.config';

@Injectable()
export class ExcelService {
  worksheet: XLSX.WorkSheet = null;
  relationTypeMap = getRelationTypes();

  constructor() {
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    this.worksheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {data: this.worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    // const excelBuffer: any =  XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellDates: true, cellStyles: true});
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    // this.setStyles(fileName);
    const data: Blob = new Blob([buffer], {type: ExcelConfig.EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + ExcelConfig.EXCEL_TYPE);
  }

  public exportToExcel(list: any[], record: string): void {
    const excelList = [];
    const transactionTypes = getTransactionTypes();
    let fileName = 'default';

    this.exportAsExcelFile(excelList, fileName);

  }

  public setStyles(record: string) {
    // https://www.npmjs.com/package/xlsx-style
    const range = XLSX.utils.decode_range(this.worksheet['!ref']);
    let wscols = null;
    if (record === 'collection') {
      this.setHeaderStyles(range, 1);
      wscols = [{wch: 10}, {wch: 10}, {wch: 10}, {wch: 10}, {wch: 40}];
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        this.setTextFmt(XLSX.utils.encode_cell({c: 0, r: R}));
        this.setTextFmt(XLSX.utils.encode_cell({c: 1, r: R}));
        this.setCurrencyFmt(XLSX.utils.encode_cell({c: 2, r: R}));
        this.setTextFmt(XLSX.utils.encode_cell({c: 3, r: R}));
        this.setTextFmt(XLSX.utils.encode_cell({c: 4, r: R}));
      }

    }
    this.worksheet['!cols'] = wscols;
    this.worksheet['!rows'] = [{hpx: 13.2}];
  }

  protected setHeaderStyles(range: any, numOfHeaders: number) {
    let i = 0;
    for (let C = range.s.c; C <= range.e.c; ++C) {
      i = 0;
      while (i < numOfHeaders) {// Set header styles
        const header1 = XLSX.utils.encode_cell({c: C, r: i});
        this.worksheet[header1].s = ExcelConfig.headerStyle;
        i++;
      }
    }
    // set general cell style
    for (let R = range.s.r + i; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const all = XLSX.utils.encode_cell({c: C, r: R});
        if (this.worksheet[all]) {
          this.worksheet[all].s = ExcelConfig.generalStyle;
        }
      }
    }
  }

  protected setDateFmt(cell: string) {
    if (this.worksheet[cell] && this.worksheet[cell].v !== '' && this.worksheet[cell].v !== 'N/A') {
      this.worksheet[cell].t = 'd';
      this.worksheet[cell].z = ExcelConfig.dateFmt;
      this.worksheet[cell].s = ExcelConfig.dateStyle;
    }
  }

  protected setTimeStampFmt(cell: string) {
    this.worksheet[cell].s = ExcelConfig.dateStyle;
  }

  protected setTextFmt(cell: string) {
    if (this.worksheet[cell]) {
      this.worksheet[cell].t = 's';
      this.worksheet[cell].s = ExcelConfig.textStyle;
    }
  }

  protected setCurrencyFmt(cell: string) {
    if (this.worksheet[cell]) {
      this.worksheet[cell].t = 'n';
      this.worksheet[cell].z = ExcelConfig.currencyFmt;
      this.worksheet[cell].s = ExcelConfig.currencyStyle;
    }
  }
}
