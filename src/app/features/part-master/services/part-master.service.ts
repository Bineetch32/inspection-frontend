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

  private readonly apiUrl = 'http://localhost:8080/api/parts';

  constructor(private http: HttpClient) {}

  getAllParts(): Observable<PartMaster[]> {
    return this.http.get<PartMaster[]>(this.apiUrl);
  }

  getPart(id: number): Observable<PartMaster> {
    return this.http.get<PartMaster>(`${this.apiUrl}/${id}`);
  }

  addPart(part: PartMaster): Observable<PartMaster> {
    return this.http.post<PartMaster>(this.apiUrl, part);
  }

  updatePart(id: number, part: PartMaster): Observable<PartMaster> {
    return this.http.put<PartMaster>(`${this.apiUrl}/${id}`, part);
  }

  deletePart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
