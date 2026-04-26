import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownService } from '../../../../core/services/dropdown.service';
import { EmployeeFamilyInfoDto } from '../../../../core/models';

@Component({
  selector: 'app-family-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="detail-section">
      <div class="section-header d-flex align-items-center justify-content-between mb-3">
        <div class="d-flex align-items-center gap-2">
          <div class="section-icon bg-pink">
            <i class="bi bi-people-fill text-white"></i>
          </div>
          <div>
            <h6 class="mb-0 fw-bold">Family Information</h6>
            <small class="text-muted">{{ rows.controls.length }} member(s)</small>
          </div>
        </div>
        @if (!readonly()) {
          <button type="button" class="btn btn-sm btn-outline-primary" (click)="addRow()">
            <i class="bi bi-plus-lg me-1"></i>Add Member
          </button>
        }
      </div>

      @if (rows.controls.length === 0) {
        <div class="empty-state text-center py-4">
          <i class="bi bi-people text-muted fs-2 d-block mb-2"></i>
          <p class="text-muted mb-0 small">No family members added yet</p>
        </div>
      }

      @for (row of rows.controls; track $index; let i = $index) {
        <div class="detail-row-card mb-3" [formGroup]="asGroup(row)">
          <div class="detail-row-header d-flex align-items-center justify-content-between px-3 py-2">
            <span class="fw-semibold small">
              <i class="bi bi-person-heart me-1 text-danger"></i>
              Member {{ i + 1 }}
              @if (asGroup(row).get('name')?.value) {
                — <span class="text-primary">{{ asGroup(row).get('name')?.value }}</span>
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
                <label class="form-label-sm">Full Name <span class="req">*</span></label>
                <input type="text" class="form-control form-control-sm"
                       formControlName="name" maxlength="50" placeholder="Member name"
                       [readonly]="readonly()">
                @if (asGroup(row).get('name')?.invalid && asGroup(row).get('name')?.touched) {
                  <div class="invalid-msg">Required (max 50 chars)</div>
                }
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Relationship <span class="req">*</span></label>
                <select class="form-select form-select-sm" formControlName="idRelationship"
                        [attr.disabled]="readonly() ? true : null">
                  <option value="">Select Relationship</option>
                  @for (r of dd.store().relationships; track r.value) {
                    <option [value]="r.value">{{ r.text }}</option>
                  }
                </select>
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Gender <span class="req">*</span></label>
                <select class="form-select form-select-sm" formControlName="idGender"
                        [attr.disabled]="readonly() ? true : null">
                  <option value="">Select Gender</option>
                  @for (g of dd.store().genders; track g.value) {
                    <option [value]="g.value">{{ g.text }}</option>
                  }
                </select>
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Date of Birth</label>
                <input type="date" class="form-control form-control-sm"
                       formControlName="dateOfBirth" [readonly]="readonly()">
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Contact No</label>
                <input type="text" class="form-control form-control-sm"
                       formControlName="contactNo" maxlength="50"
                       placeholder="+880..." [readonly]="readonly()">
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label-sm">Current Address</label>
                <input type="text" class="form-control form-control-sm"
                       formControlName="currentAddress" maxlength="500"
                       placeholder="Current address" [readonly]="readonly()">
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .section-icon { width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center; }
    .bg-pink { background: linear-gradient(135deg,#ec4899,#be185d); }
    .detail-row-card { border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff; }
    .detail-row-header { background:#f8fafc;border-bottom:1px solid #e5e7eb; }
    .form-label-sm { font-size:0.75rem;font-weight:600;color:#374151;margin-bottom:3px;display:block; }
    .req { color:#ef4444; }
    .invalid-msg { font-size:0.7rem;color:#dc2626;margin-top:2px; }
    .empty-state { background:#f9fafb;border-radius:12px;border:2px dashed #d1d5db; }
    .btn-xs { font-size:0.75rem;padding:2px 6px; }
  `]
})
export class FamilyInfoComponent {
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
      name: ['', [Validators.required, Validators.maxLength(50)]],
      idRelationship: ['', Validators.required],
      idGender: ['', Validators.required],
      dateOfBirth: [null],
      contactNo: ['', Validators.maxLength(50)],
      currentAddress: ['', Validators.maxLength(500)],
      permanentAddress: ['', Validators.maxLength(500)]
    }));
  }

  removeRow(i: number) {
    this.rows.removeAt(i);
  }
}
