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
  fromDate = '';
  toDate = '';
  status = '';
  model = '';

  models: string[] = [];

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

        this.models = [...new Set(
          this.records
            .map(record => record.model)
            .filter(model => !!model)
        )].sort();

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

    const search = this.searchText.trim().toLowerCase();

    this.filteredRecords = this.records.filter(record => {

      const matchesSearch =
        !search ||
        [
          record.partNo,
          record.partName,
          record.vendorCode,
          record.vendorName,
          record.model,
          record.inspectionStatus,
          record.defectDescription
        ].some(field =>
          (field ?? '').toLowerCase().includes(search)
        );

      const matchesFromDate =
        !this.fromDate ||
        record.inspectionDate >= this.fromDate;

      const matchesToDate =
        !this.toDate ||
        record.inspectionDate <= this.toDate;

      const matchesStatus =
        !this.status ||
        record.inspectionStatus?.toUpperCase() === this.status;

      const matchesModel =
        !this.model ||
        record.model?.toLowerCase() === this.model.toLowerCase();

      return (
        matchesSearch &&
        matchesFromDate &&
        matchesToDate &&
        matchesStatus &&
        matchesModel
      );
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.fromDate = '';
    this.toDate = '';
    this.status = '';
    this.model = '';
    this.applyFilter();
  }
}
