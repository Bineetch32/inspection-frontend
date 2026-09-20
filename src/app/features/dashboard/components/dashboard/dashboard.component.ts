import { Component, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import {
  InspectionHistoryRecord,
  InspectionHistoryService
} from '../../../inspection/services/inspection-history.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  private readonly platformId = inject(PLATFORM_ID);

  totalInspections = 0;
  okRecords = 0;
  ngRecords = 0;
  uniqueParts = 0;
  recentRecords: InspectionHistoryRecord[] = [];
  errorMessage = '';

  constructor(
    private historyService: InspectionHistoryService,
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

    this.loadDashboard();
  }

  loadDashboard(): void {
    this.historyService.getAll().subscribe({
      next: (records) => {

        this.totalInspections = records.length;

        this.okRecords = records.filter(
          record => record.inspectionStatus?.toUpperCase() === 'OK'
        ).length;

        this.ngRecords = records.filter(
          record => record.inspectionStatus?.toUpperCase() === 'NG'
        ).length;

        this.uniqueParts = new Set(
          records
            .map(record => record.partNo)
            .filter(partNo => !!partNo)
        ).size;

        this.recentRecords = [...records]
          .sort((a, b) =>
            (b.id ?? 0) - (a.id ?? 0)
          )
          .slice(0, 5);
      },
      error: () => {
        this.errorMessage =
          'Unable to load dashboard data from MySQL.';
      }
    });
  }
}
