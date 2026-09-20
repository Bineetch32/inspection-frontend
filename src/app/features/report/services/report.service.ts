import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportFilters {
  fromDate?: string;
  toDate?: string;
  model?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly apiUrl = environment.apiUrl;
  private readonly storageKey = 'inspectionReport';

  constructor(private http: HttpClient) {}

  getCurrentReport(filters: ReportFilters = {}): Observable<any> {

    let params = new HttpParams();

    if (filters.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }

    if (filters.toDate) {
      params = params.set('toDate', filters.toDate);
    }

    if (filters.model) {
      params = params.set('model', filters.model);
    }

    return this.http.get<any>(
      `${this.apiUrl}/current`,
      { params }
    );
  }

  generateCurrentPdf(filters: ReportFilters = {}): Observable<Blob> {

    let params = new HttpParams();

    if (filters.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }

    if (filters.toDate) {
      params = params.set('toDate', filters.toDate);
    }

    if (filters.model) {
      params = params.set('model', filters.model);
    }

    return this.http.get(
      `${this.apiUrl}/pdf/current`,
      {
        params,
        responseType: 'blob'
      }
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
