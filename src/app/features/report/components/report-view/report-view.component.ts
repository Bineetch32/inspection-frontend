import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ReportFilters,
  ReportService
} from '../../services/report.service';

@Component({
  selector: 'app-report-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.css'
})
export class ReportViewComponent implements OnInit {

  private readonly platformId = inject(PLATFORM_ID);

  report: any = null;
  loading = true;
  loadingPdf = false;
  errorMessage = '';

  fromDate = '';
  toDate = '';
  selectedModel = '';
  modelOptions: string[] = [];

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

    this.reportService
      .getCurrentReport(this.getFilters())
      .subscribe({

        next: (response) => {

          if (!response?.reportGenerationAllowed) {

            this.report = null;
            this.errorMessage =
              response?.message ||
              'No inspection records found for selected filters.';

          } else {

            this.report = response;
            this.reportService.saveReport(response);

            if (this.modelOptions.length === 0) {
              this.modelOptions =
                (response.modelWiseSummary ?? [])
                  .map((item: any) => item.model)
                  .filter((model: string) => !!model);
            }
          }

          this.loading = false;
        },

        error: (error) => {

          this.loading = false;

          this.errorMessage =
            typeof error?.error === 'string'
              ? error.error
              : 'Unable to load report from MySQL.';
        }
      });
  }

  applyFilters(): void {
    this.loadReport();
  }

  clearFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    this.selectedModel = '';
    this.loadReport();
  }

  private getFilters(): ReportFilters {
    return {
      fromDate: this.fromDate,
      toDate: this.toDate,
      model: this.selectedModel
    };
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

    this.reportService
      .generateCurrentPdf(this.getFilters())
      .subscribe({

        next: (blob) => {

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');

          link.href = url;
          link.download = 'Inspection-Report.pdf';
          link.click();

          window.URL.revokeObjectURL(url);
          this.loadingPdf = false;
        },

        error: (error) => {

          this.loadingPdf = false;

          this.errorMessage =
            typeof error?.error === 'string'
              ? error.error
              : 'PDF generation failed.';
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
