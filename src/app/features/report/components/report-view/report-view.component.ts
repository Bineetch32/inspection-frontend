import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionService } from '../../../inspection/services/inspection.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report-view',
  imports: [CommonModule],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.css'
})
export class ReportViewComponent implements OnInit {

  private readonly platformId = inject(PLATFORM_ID);

  report: any = null;
  loadingPdf = false;
  errorMessage = '';

  constructor(
    private reportService: ReportService,
    private inspectionService: InspectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.report = this.reportService.getReport();

    if (!this.report) {
      this.router.navigate(['/inspection/upload']);
    }
  }

  hasDefects(): boolean {
    const defects = this.report?.defectSummary;

    if (!defects || typeof defects !== 'object') {
      return false;
    }

    return Object.keys(defects).length > 0;
  }

  downloadPdf(): void {
    const file = this.inspectionService.getSelectedFile();

    if (!file) {
      this.errorMessage = 'Original Excel file is not available. Please upload the file again.';
      return;
    }

    this.loadingPdf = true;
    this.errorMessage = '';

    this.inspectionService.generatePdf(file).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'Inspection-Report.pdf';
        link.click();

        window.URL.revokeObjectURL(url);
        this.loadingPdf = false;
      },
      error: () => {
        this.loadingPdf = false;
        this.errorMessage = 'PDF generation failed. Please check that the backend is running.';
      }
    });
  }

  backToUpload(): void {
    this.router.navigate(['/inspection/upload']);
  }

  backToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
