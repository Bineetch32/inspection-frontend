import { Component, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReportService } from '../../../report/services/report.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  private readonly platformId = inject(PLATFORM_ID);

  totalInspections = 0;
  validRecords = 0;
  warnings = 0;
  reports = 0;
  recentParts: any[] = [];

  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const report = this.reportService.getReport();

    if (!report) {
      return;
    }

    this.totalInspections = report.totalRecords ?? 0;
    this.validRecords = report.validRecords ?? 0;
    this.warnings = report.invalidRecords ?? 0;
    this.reports = report.reportGenerationAllowed ? 1 : 0;
    this.recentParts = (report.partWiseSummary ?? []).slice(0, 5);
  }
}
