import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PartMaster, PartMasterService } from '../../services/part-master.service';

@Component({
  selector: 'app-part-add',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './part-add.component.html',
  styleUrl: './part-add.component.css'
})
export class PartAddComponent implements OnInit {

  private readonly platformId = inject(PLATFORM_ID);

  partId: number | null = null;
  editMode = false;
  loading = false;
  saving = false;
  errorMessage = '';

  part: PartMaster = {
    partNo: '',
    partName: '',
    vendorCode: '',
    vendorName: '',
    model: '',
    packaging: '',
    active: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partMasterService: PartMasterService
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.partId = Number(id);
      this.editMode = true;
      this.loadPart();
    }
  }

  loadPart(): void {
    if (!this.partId) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.partMasterService.getPart(this.partId).subscribe({
      next: (part) => {
        this.part = part;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load the selected Part Master record.';
      }
    });
  }

  save(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const payload: PartMaster = {
      ...this.part,
      partNo: this.part.partNo.trim(),
      partName: this.part.partName.trim(),
      vendorCode: this.part.vendorCode.trim(),
      vendorName: this.part.vendorName.trim(),
      model: this.part.model.trim(),
      packaging: this.part.packaging.trim()
    };

    const request = this.editMode && this.partId
      ? this.partMasterService.updatePart(this.partId, payload)
      : this.partMasterService.addPart(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/part-master']);
      },
      error: (error) => {
        this.saving = false;
        this.errorMessage =
          typeof error?.error === 'string'
            ? error.error
            : 'Unable to save Part Master. Please check the entered data.';
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.part.partNo.trim() &&
      this.part.partName.trim() &&
      this.part.vendorCode.trim() &&
      this.part.vendorName.trim() &&
      this.part.model.trim() &&
      this.part.packaging.trim()
    );
  }

  cancel(): void {
    this.router.navigate(['/part-master']);
  }
}
