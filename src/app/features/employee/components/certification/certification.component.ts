import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-certification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="detail-section">
      <div class="section-header d-flex align-items-center justify-content-between mb-3">
        <div class="d-flex align-items-center gap-2">
          <div class="section-icon bg-purple">
            <i class="bi bi-award-fill text-white"></i>
          </div>
          <div>
            <h6 class="mb-0 fw-bold">Professional Certifications</h6>
            <small class="text-muted">{{ rows.controls.length }} certification(s)</small>
          </div>
        </div>
        @if (!readonly()) {
          <button type="button" class="btn btn-sm btn-outline-purple" (click)="addRow()">
            <i class="bi bi-plus-lg me-1"></i>Add Certification
          </button>
        }
      </div>

      @if (rows.controls.length === 0) {
        <div class="empty-state text-center py-4">
          <i class="bi bi-award text-muted fs-2 d-block mb-2"></i>
          <p class="text-muted mb-0 small">No certifications added yet</p>
        </div>
      }

      @for (row of rows.controls; track $index; let i = $index) {
        <div class="cert-card mb-3" [formGroup]="asGroup(row)">
          <div class="cert-header d-flex align-items-center justify-content-between px-3 py-2">
            <span class="fw-semibold small">
              <i class="bi bi-patch-check me-1 text-purple"></i>
              Certification {{ i + 1 }}
              @if (asGroup(row).get('certificationTitle')?.value) {
                — <span class="text-purple">{{ asGroup(row).get('certificationTitle')?.value }}</span>
              }
            </span>
            @if (!readonly()) {
              <button type="button" class="btn btn-xs text-danger border-0" (click)="removeRow(i)">
                <i class="bi bi-x-circle-fill"></i>
              </button>
            }
          </div>
          <div class="px-3 pb-3 pt-2">
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label-sm">Certification Title <span class="req">*</span></label>
                <input type="text" class="form-control form-control-sm"
                       formControlName="certificationTitle" maxlength="255"
                       placeholder="e.g. AWS Certified Developer" [readonly]="readonly()">
              </div>
              <div class="col-md-6">
                <label class="form-label-sm">Institute <span class="req">*</span></label>
                <input type="text" class="form-control form-control-sm"
                       formControlName="certificationInstitute" maxlength="250"
                       placeholder="Issuing organization" [readonly]="readonly()">
              </div>
              <div class="col-md-4">
                <label class="form-label-sm">Location <span class="req">*</span></label>
                <input type="text" class="form-control form-control-sm"
                       formControlName="instituteLocation" maxlength="250"
                       placeholder="City, Country" [readonly]="readonly()">
              </div>
              <div class="col-md-4">
                <label class="form-label-sm">From Date <span class="req">*</span></label>
                <input type="date" class="form-control form-control-sm"
                       formControlName="fromDate" [readonly]="readonly()">
              </div>
              <div class="col-md-4">
                <label class="form-label-sm">To Date</label>
                <input type="date" class="form-control form-control-sm"
                       formControlName="toDate" [readonly]="readonly()">
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .section-icon { width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center; }
    .bg-purple { background: linear-gradient(135deg,#a855f7,#7c3aed); }
    .cert-card { border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff; }
    .cert-header { background:#faf5ff;border-bottom:1px solid #ede9fe; }
    .text-purple { color:#7c3aed; }
    .btn-outline-purple { color:#7c3aed;border-color:#7c3aed; }
    .btn-outline-purple:hover { background:#7c3aed;color:#fff; }
    .form-label-sm { font-size:0.75rem;font-weight:600;color:#374151;margin-bottom:3px;display:block; }
    .req { color:#ef4444; }
    .empty-state { background:#f9fafb;border-radius:12px;border:2px dashed #d1d5db; }
    .btn-xs { font-size:0.75rem;padding:2px 6px;background:none;border:none; }
  `]
})
export class CertificationComponent {
  readonly = input<boolean>(false);
  formArray = input.required<FormArray>();

  private fb = inject(FormBuilder);
  get rows(): FormArray { return this.formArray(); }
  asGroup(ctrl: any): FormGroup { return ctrl as FormGroup; }

  addRow() {
    this.rows.push(this.fb.group({
      id: [null],
      idEmployee: [0],
      certificationTitle: ['', [Validators.required, Validators.maxLength(255)]],
      certificationInstitute: ['', [Validators.required, Validators.maxLength(250)]],
      instituteLocation: ['', [Validators.required, Validators.maxLength(250)]],
      fromDate: ['', Validators.required],
      toDate: [null]
    }));
  }

  removeRow(i: number) { this.rows.removeAt(i); }
}
