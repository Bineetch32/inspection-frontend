import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PartMaster {
  id?: number;
  partNo: string;
  partName: string;
  vendorCode: string;
  vendorName: string;
  model: string;
  packaging: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PartMasterService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllParts(): Observable<PartMaster[]> {
    return this.http.get<PartMaster[]>(`${this.apiUrl}/parts`);
  }

  getPart(id: number): Observable<PartMaster> {
    return this.http.get<PartMaster>(`${this.apiUrl}/parts/${id}`);
  }

  addPart(part: PartMaster): Observable<PartMaster> {
    return this.http.post<PartMaster>(`${this.apiUrl}/parts`, part);
  }

  updatePart(id: number, part: PartMaster): Observable<PartMaster> {
    return this.http.put<PartMaster>(`${this.apiUrl}/parts/${id}`, part);
  }

  deletePart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/parts/${id}`);
  }

  importExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${this.apiUrl}/parts/import-excel`,
      formData
    );
  }

  downloadTemplate(): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/parts/template`,
      { responseType: 'blob' }
    );
  }
}
