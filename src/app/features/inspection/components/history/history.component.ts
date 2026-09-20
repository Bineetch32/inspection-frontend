import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  InspectionHistoryRecord,
  InspectionHistoryService
} from '../../services/inspection-history.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {

  records: InspectionHistoryRecord[] = [];
  filteredRecords: InspectionHistoryRecord[] = [];
  searchText = '';
  loading = false;
  errorMessage = '';

  constructor(private service: InspectionHistoryService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.errorMessage = '';

    this.service.getAll().subscribe({
      next: (records) => {
        this.records = [...records].reverse();
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage =
          'Unable to load inspection history. Make sure the backend is running.';
      }
    });
  }

  applyFilter(): void {
    const value = this.searchText.trim().toLowerCase();

    this.filteredRecords = value
      ? this.records.filter(record =>
          [
            record.partNo,
            record.partName,
            record.vendorCode,
            record.vendorName,
            record.model,
            record.inspectionStatus,
            record.defectDescription
          ].some(field =>
            (field ?? '').toLowerCase().includes(value)
          )
        )
      : [...this.records];
  }
}
