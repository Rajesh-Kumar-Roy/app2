import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownService } from '../../../../core/services/dropdown.service';

@Component({
  selector: 'app-education-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="detail-section">
      <div class="section-header d-flex align-items-center justify-content-between mb-3">
        <div class="d-flex align-items-center gap-2">
          <div class="section-icon bg-green">
            <i class="bi bi-mortarboard-fill text-white"></i>
          </div>
          <div>
            <h6 class="mb-0 fw-bold">Education Information</h6>
            <small class="text-muted">{{ rows.controls.length }} record(s)</small>
          </div>
        </div>
        @if (!readonly()) {
          <button type="button" class="btn btn-sm btn-outline-success" (click)="addRow()">
            <i class="bi bi-plus-lg me-1"></i>Add Education
          </button>
        }
      </div>

      @if (rows.controls.length === 0) {
        <div class="empty-state text-center py-4">
          <i class="bi bi-book text-muted fs-2 d-block mb-2"></i>
          <p class="text-muted mb-0 small">No education records added yet</p>
        </div>
      }

      @for (row of rows.controls; track $index; let i = $index) {
        <div class="detail-row-card mb-3" [formGroup]="asGroup(row)">
          <div class="detail-row-header d-flex align-items-center justify-content-between px-3 py-2">
            <span class="fw-semibold small">
              <i class="bi bi-journal-bookmark me-1 text-success"></i>
              Education {{ i + 1 }}
              @if (asGroup(row).get('instituteName')?.value) {
                — <span class="text-success">{{ asGroup(row).get('instituteName')?.value }}</span>
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
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Education Level <span class="req">*</span></label>
                <select class="form-select form-select-sm" formControlName="idEducationLevel"
                        [attr.disabled]="readonly() ? true : null">
                  <option value="">Select Level</option>
                  @for (l of dd.store().educationLevels; track l.value) {
                    <option [value]="l.value">{{ l.text }}</option>
                  }
                </select>
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Examination <span class="req">*</span></label>
                <select class="form-select form-select-sm" formControlName="idEducationExamination"
                        [attr.disabled]="readonly() ? true : null">
                  <option value="">Select Examination</option>
                  @for (e of dd.store().educationExaminations; track e.value) {
                    <option [value]="e.value">{{ e.text }}</option>
                  }
                </select>
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Major / Subject <span class="req">*</span></label>
                <input type="text" class="form-control form-control-sm"
                       formControlName="major" maxlength="50"
                       placeholder="e.g. Computer Science" [readonly]="readonly()">
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Institute Name <span class="req">*</span></label>
                <input type="text" class="form-control form-control-sm"
                       formControlName="instituteName" maxlength="250"
                       placeholder="Institution name" [readonly]="readonly()">
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Passing Year <span class="req">*</span></label>
                <input type="number" class="form-control form-control-sm"
                       formControlName="passingYear" min="1970" max="2030"
                       placeholder="e.g. 2020" [readonly]="readonly()">
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">CGPA / Result</label>
                <input type="number" class="form-control form-control-sm"
                       formControlName="cgpa" min="0" max="5" step="0.01"
                       placeholder="e.g. 3.75" [readonly]="readonly()">
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Exam Scale</label>
                <input type="number" class="form-control form-control-sm"
                       formControlName="examScale" min="0" step="0.01"
                       placeholder="e.g. 4.0 or 5.0" [readonly]="readonly()">
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Duration (years)</label>
                <input type="number" class="form-control form-control-sm"
                       formControlName="duration" min="0" step="0.5"
                       placeholder="e.g. 4" [readonly]="readonly()">
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Foreign Institute?</label>
                <div class="form-check mt-1">
                  <input class="form-check-input" type="checkbox"
                         formControlName="isForeignInstitute"
                         [attr.disabled]="readonly() ? true : null">
                  <label class="form-check-label small">Yes, foreign institute</label>
                </div>
              </div>
              <div class="col-12">
                <label class="form-label-sm">Achievement / Notes</label>
                <textarea class="form-control form-control-sm" rows="2"
                          formControlName="achievement" maxlength="500"
                          placeholder="Any awards, honours..." [readonly]="readonly()"></textarea>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .section-icon { width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center; }
    .bg-green { background: linear-gradient(135deg,#22c55e,#15803d); }
    .detail-row-card { border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff; }
    .detail-row-header { background:#f0fdf4;border-bottom:1px solid #d1fae5; }
    .form-label-sm { font-size:0.75rem;font-weight:600;color:#374151;margin-bottom:3px;display:block; }
    .req { color:#ef4444; }
    .empty-state { background:#f9fafb;border-radius:12px;border:2px dashed #d1d5db; }
    .btn-xs { font-size:0.75rem;padding:2px 6px; }
  `]
})
export class EducationInfoComponent {
  readonly = input<boolean>(false);
  formArray = input.required<FormArray>();

  dd = inject(DropdownService);
  private fb = inject(FormBuilder);

  get rows(): FormArray { return this.formArray(); }
  asGroup(ctrl: any): FormGroup { return ctrl as FormGroup; }

  addRow() {
    this.rows.push(this.fb.group({
      id: [null],
      idEmployee: [0],
      idEducationLevel: ['', Validators.required],
      idEducationExamination: ['', Validators.required],
      idEducationResult: [''],
      major: ['', [Validators.required, Validators.maxLength(50)]],
      passingYear: ['', Validators.required],
      instituteName: ['', [Validators.required, Validators.maxLength(250)]],
      isForeignInstitute: [false],
      cgpa: [null],
      examScale: [null],
      marks: [null],
      duration: [null],
      achievement: ['', Validators.maxLength(500)]
    }));
  }

  removeRow(i: number) {
    this.rows.removeAt(i);
  }
}
