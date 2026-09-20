import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  loading = true;
  loadingPdf = false;
  errorMessage = '';

  constructor(
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.errorMessage = '';

    this.reportService.getCurrentReport().subscribe({
      next: (response) => {

        if (!response?.reportGenerationAllowed) {
          this.report = null;
          this.errorMessage =
            response?.message || 'No inspection records found.';
        } else {
          this.report = response;
          this.reportService.saveReport(response);
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage =
          'Unable to load report from MySQL. Please check the backend.';
      }
    });
  }

  hasDefects(): boolean {
    const defects = this.report?.defectSummary;

    return !!(
      defects &&
      typeof defects === 'object' &&
      Object.keys(defects).length
    );
  }

  downloadPdf(): void {

    this.loadingPdf = true;
    this.errorMessage = '';

    this.reportService.generateCurrentPdf().subscribe({
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
        this.errorMessage =
          'PDF generation failed. Please check the backend.';
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
