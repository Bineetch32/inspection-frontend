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
}
