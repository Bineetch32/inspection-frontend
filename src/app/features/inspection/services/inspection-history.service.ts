import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InspectionHistoryRecord {
  id: number;
  inspectionDate: string;
  partNo: string;
  partName: string;
  vendorCode: string;
  vendorName: string;
  model: string;
  quantityChecked: number;
  okQuantity: number;
  ngQuantity: number;
  inspectionStatus: string;
  defectDescription: string;
  packagingStatus: string;
  checkedBy: string;
  verifiedBy: string;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class InspectionHistoryService {

  private readonly apiUrl = 'http://localhost:8080/api/inspections';

  constructor(private http: HttpClient) {}

  getAll(): Observable<InspectionHistoryRecord[]> {
    return this.http.get<InspectionHistoryRecord[]>(this.apiUrl);
  }
}
