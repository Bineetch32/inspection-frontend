import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly storageKey = 'inspectionReport';

  saveReport(report: any): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(report));
  }

  getReport(): any | null {
    const data = sessionStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  clearReport(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}