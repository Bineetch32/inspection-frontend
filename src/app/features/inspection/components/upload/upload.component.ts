import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InspectionService } from '../../services/inspection.service';
import { ReportService } from '../../../report/services/report.service';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

  selectedFile: File | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  report: any = null;

  constructor(
    private inspectionService: InspectionService,
    private reportService: ReportService,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedFile = input.files?.[0] ?? null;
    this.errorMessage = '';
    this.successMessage = '';
    this.report = null;
  }

  calculateReport(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an Excel file first.';
      return;
    }

    const fileName = this.selectedFile.name.toLowerCase();

    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      this.errorMessage = 'Only Excel files (.xlsx / .xls) are allowed.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.inspectionService.calculateReport(this.selectedFile)
      .subscribe({
        next: (response) => {
          this.report = response;
          this.reportService.saveReport(response);
          this.loading = false;

          if (response.reportGenerationAllowed) {
            this.successMessage = 'Inspection data validated successfully.';
          } else {
            this.errorMessage = 'Report generation is blocked. Please fix the validation errors.';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error?.error?.message ||
            'Unable to connect to the backend. Make sure Spring Boot is running on port 8080.';
        }
      });
  }

  openDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}