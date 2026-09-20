import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  private readonly apiUrl = 'http://localhost:8080/api';
  private selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  setSelectedFile(file: File): void {
    this.selectedFile = file;
  }

  getSelectedFile(): File | null {
    return this.selectedFile;
  }

  calculateReport(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${this.apiUrl}/report/calculate`,
      formData
    );
  }

  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${this.apiUrl}/excel/upload`,
      formData
    );
  }

  generatePdf(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.apiUrl}/report/pdf`,
      formData,
      { responseType: 'blob' }
    );
  }
}