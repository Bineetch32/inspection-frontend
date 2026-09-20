import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly apiUrl = 'http://localhost:8080/api/report';
  private readonly storageKey = 'inspectionReport';

  constructor(private http: HttpClient) {}

  getCurrentReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/current`);
  }

  generateCurrentPdf(): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/pdf/current`,
      { responseType: 'blob' }
    );
  }

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
