import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReportService } from '../../../report/services/report.service';

@Component({
  selector: 'app-validation-result',
  imports: [CommonModule, RouterLink],
  templateUrl: './validation-result.component.html',
  styleUrl: './validation-result.component.css'
})
export class ValidationResultComponent implements OnInit {

  report: any = null;

  constructor(
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.report = this.reportService.getReport();

    if (!this.report) {
      this.router.navigate(['/inspection/upload']);
    }
  }

  openReport(): void {
    if (this.report?.reportGenerationAllowed) {
      this.router.navigate(['/report']);
    }
  }

  downloadErrors(): void {

    const rows: string[][] = [
      ['Type', 'Part No', 'Sheet', 'Excel Row', 'Inspection Date', 'Message']
    ];

    for (const warning of this.report?.validationWarnings ?? []) {
      for (const error of warning.errors ?? []) {
        rows.push([
          'Validation Error',
          warning.partNo ?? '',
          warning.sheetName ?? '',
          String(warning.excelRow ?? ''),
          warning.inspectionDate ?? '',
          error
        ]);
      }
    }

    for (const warning of this.report?.duplicateWarnings ?? []) {
      rows.push([
        'Duplicate',
        warning.partNo ?? '',
        warning.sheetName ?? '',
        String(warning.duplicateRow ?? ''),
        '',
        warning.message ?? 'Duplicate inspection entry found.'
      ]);
    }

    if (rows.length === 1) {
      return;
    }

    const csv = rows
      .map(row =>
        row.map(value =>
          '"' + String(value).replace(/"/g, '""') + '"'
        ).join(',')
      )
      .join('\r\n');

    const blob = new Blob(
      ['\uFEFF', csv],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'Inspection-Validation-Errors.csv';
    link.click();

    window.URL.revokeObjectURL(url);
  }
}
