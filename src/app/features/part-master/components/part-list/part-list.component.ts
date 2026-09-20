import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PartMaster, PartMasterService } from '../../services/part-master.service';

@Component({
  selector: 'app-part-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './part-list.component.html',
  styleUrl: './part-list.component.css'
})
export class PartListComponent implements OnInit {

  private readonly platformId = inject(PLATFORM_ID);

  parts: PartMaster[] = [];
  filteredParts: PartMaster[] = [];
  searchText = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private partMasterService: PartMasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadParts();
  }

  loadParts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.partMasterService.getAllParts().subscribe({
      next: (parts) => {
        this.parts = parts;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage =
          'Unable to load Part Master. Make sure the backend and MySQL are running.';
      }
    });
  }

  applyFilter(): void {
    const value = this.searchText.trim().toLowerCase();

    if (!value) {
      this.filteredParts = [...this.parts];
      return;
    }

    this.filteredParts = this.parts.filter(part =>
      [
        part.partNo,
        part.partName,
        part.vendorCode,
        part.vendorName,
        part.model,
        part.packaging
      ].some(field =>
        (field ?? '').toLowerCase().includes(value)
      )
    );
  }

  addPart(): void {
    this.router.navigate(['/part-master/add']);
  }

  editPart(id?: number): void {
    if (id) {
      this.router.navigate(['/part-master/edit', id]);
    }
  }

  deletePart(part: PartMaster): void {
    if (!part.id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete Part No. "${part.partNo}" from Part Master?`
    );

    if (!confirmed) {
      return;
    }

    this.partMasterService.deletePart(part.id).subscribe({
      next: () => {
        this.successMessage = 'Part deleted successfully.';
        this.loadParts();
      },
      error: () => {
        this.errorMessage = 'Unable to delete the part.';
      }
    });
  }
}
