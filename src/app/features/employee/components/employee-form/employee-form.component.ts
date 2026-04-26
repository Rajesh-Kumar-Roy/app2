import {
  Component, inject, OnInit, effect, signal
} from '@angular/core';
import {
  FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EmployeeStateService } from '../../../../core/services/employee-state.service';
import { DropdownService } from '../../../../core/services/dropdown.service';
import { FileUtilService } from '../../../../core/services/file-util.service';
import { ToastService } from '../../../../core/services/toast.service';
import { EmployeeDto } from '../../../../core/models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="hrm-form-root" [formGroup]="form">

    <!-- ══ TOP BAR ══ -->
    <div class="top-bar d-flex align-items-center justify-content-between px-3">
      <span class="top-bar-title">
        {{ state.mode() === 'edit' ? 'Edit Employee' : 'New Employee' }}
        @if (state.selectedEmployee()?.id) {
          <span class="ms-2 emp-id-badge">#{{ state.selectedEmployee()?.id }}</span>
        }
      </span>
      <div class="d-flex gap-2">
        @if (!isViewOnly()) {
          <button type="button" class="btn-action btn-add"
                  [disabled]="state.saving()" (click)="onSave()">
            @if (state.saving()) {
              <span class="spinner-border spinner-border-sm"></span>
            } @else {
              {{ state.mode() === 'edit' ? 'Update' : 'Add' }}
            }
          </button>
        }
        @if (state.mode() === 'edit') {
          <button type="button" class="btn-action btn-toggle" (click)="toggleViewMode()">
            {{ isViewOnly() ? 'Edit' : 'View' }}
          </button>
        }
        <button type="button" class="btn-action btn-reset" (click)="onReset()">Reset</button>
      </div>
    </div>

    <div class="form-body">

      <!-- ══ BASIC INFORMATION ══ -->
      <div class="section-block">
        <div class="section-header">Basic Information</div>
        <div class="section-body">
          <div class="row g-3">
            <div class="col-lg-3 col-md-6">
              <label class="field-label">EMPLOYEE NAME <span class="req">*</span></label>
              <input type="text" class="form-control fld"
                     formControlName="employeeName" placeholder="Enter full name"
                     maxlength="250" [class.is-invalid]="showErr('employeeName')"
                     [readonly]="isViewOnly()">
              @if (showErr('employeeName')) {
                <div class="err-msg">Name is required.</div>
              }
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">NAME (BANGLA)</label>
              <input type="text" class="form-control fld"
                     formControlName="employeeNameBangla" placeholder="বাংলায় নাম লিখুন"
                     maxlength="250" [readonly]="isViewOnly()">
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">FATHER'S NAME</label>
              <input type="text" class="form-control fld"
                     formControlName="fatherName" placeholder="Father's name"
                     maxlength="250" [readonly]="isViewOnly()">
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">MOTHER'S NAME</label>
              <input type="text" class="form-control fld"
                     formControlName="motherName" placeholder="Mother's name"
                     maxlength="250" [readonly]="isViewOnly()">
            </div>

            <div class="col-lg-3 col-md-6">
              <label class="field-label">CONTACT NO</label>
              <input type="text" class="form-control fld"
                     formControlName="contactNo" placeholder="+880..."
                     maxlength="250" [readonly]="isViewOnly()">
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">NID NUMBER</label>
              <input type="text" class="form-control fld"
                     formControlName="nationalIdentificationNumber" placeholder="National ID"
                     maxlength="30" [readonly]="isViewOnly()">
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">DATE OF BIRTH</label>
              <input type="date" class="form-control fld"
                     formControlName="birthDate" [readonly]="isViewOnly()">
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">JOINING DATE</label>
              <input type="date" class="form-control fld"
                     formControlName="joiningDate" [readonly]="isViewOnly()">
            </div>

            <div class="col-lg-6 col-md-6">
              <label class="field-label">PERMANENT ADDRESS</label>
              <input type="text" class="form-control fld"
                     formControlName="address" placeholder="Permanent address"
                     maxlength="250" [readonly]="isViewOnly()">
            </div>
            <div class="col-lg-6 col-md-6">
              <label class="field-label">PRESENT ADDRESS</label>
              <input type="text" class="form-control fld"
                     formControlName="presentAddress" placeholder="Present address"
                     maxlength="250" [readonly]="isViewOnly()">
            </div>
          </div>
        </div>
      </div>

      <!-- ══ JOB CLASSIFICATION ══ -->
      <div class="section-block">
        <div class="section-header">Job Classification</div>
        <div class="section-body">
          <div class="row g-3">
            <div class="col-lg-3 col-md-6">
              <label class="field-label">DEPARTMENT <span class="req">*</span></label>
              <select class="form-select fld" formControlName="idDepartment"
                      [class.is-invalid]="showErr('idDepartment')"
                      [attr.disabled]="isViewOnly() ? true : null">
                <option value="">-- Select --</option>
                @for (d of dd.store().departments; track d.value) {
                  <option [value]="d.value">{{ d.text }}</option>
                }
              </select>
              @if (showErr('idDepartment')) { <div class="err-msg">Department is required.</div> }
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">SECTION <span class="req">*</span></label>
              <select class="form-select fld" formControlName="idSection"
                      [class.is-invalid]="showErr('idSection')"
                      [attr.disabled]="isViewOnly() ? true : null">
                <option value="">-- Select --</option>
                @for (s of dd.store().sections; track s.value) {
                  <option [value]="s.value">{{ s.text }}</option>
                }
              </select>
              @if (showErr('idSection')) { <div class="err-msg">Section is required.</div> }
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">DESIGNATION</label>
              <select class="form-select fld" formControlName="idDesignation"
                      [attr.disabled]="isViewOnly() ? true : null">
                <option value="">-- Select --</option>
                @for (d of dd.store().designations; track d.value) {
                  <option [value]="d.value">{{ d.text }}</option>
                }
              </select>
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">JOB TYPE</label>
              <select class="form-select fld" formControlName="idJobType"
                      [attr.disabled]="isViewOnly() ? true : null">
                <option value="">-- Select --</option>
                @for (j of dd.store().jobTypes; track j.value) {
                  <option [value]="j.value">{{ j.text }}</option>
                }
              </select>
            </div>

            <div class="col-lg-3 col-md-6">
              <label class="field-label">EMPLOYEE TYPE</label>
              <select class="form-select fld" formControlName="idEmployeeType"
                      [attr.disabled]="isViewOnly() ? true : null">
                <option value="">-- Select --</option>
                @for (t of dd.store().employeeTypes; track t.value) {
                  <option [value]="t.value">{{ t.text }}</option>
                }
              </select>
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">WEEK OFF</label>
              <select class="form-select fld" formControlName="idWeekOff"
                      [attr.disabled]="isViewOnly() ? true : null">
                <option value="">-- Select --</option>
                @for (w of dd.store().weekOffs; track w.value) {
                  <option [value]="w.value">{{ w.text }}</option>
                }
              </select>
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">GENDER</label>
              <select class="form-select fld" formControlName="idGender"
                      [attr.disabled]="isViewOnly() ? true : null">
                <option value="">-- Select --</option>
                @for (g of dd.store().genders; track g.value) {
                  <option [value]="g.value">{{ g.text }}</option>
                }
              </select>
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">RELIGION</label>
              <select class="form-select fld" formControlName="idReligion"
                      [attr.disabled]="isViewOnly() ? true : null">
                <option value="">-- Select --</option>
                @for (r of dd.store().religions; track r.value) {
                  <option [value]="r.value">{{ r.text }}</option>
                }
              </select>
            </div>

            <div class="col-lg-3 col-md-6">
              <label class="field-label">MARITAL STATUS</label>
              <select class="form-select fld" formControlName="idMaritalStatus"
                      [attr.disabled]="isViewOnly() ? true : null">
                <option value="">-- Select --</option>
                @for (m of dd.store().maritalStatuses; track m.value) {
                  <option [value]="m.value">{{ m.text }}</option>
                }
              </select>
            </div>
            <div class="col-lg-3 col-md-6">
              <label class="field-label">REPORTING MANAGER</label>
              <select class="form-select fld" formControlName="idReportingManager"
                      [attr.disabled]="isViewOnly() ? true : null">
                <option value="">-- Select --</option>
                @for (e of state.employeeList(); track e.id) {
                  <option [value]="e.id">{{ e.employeeName }}</option>
                }
              </select>
            </div>
            <div class="col-lg-6 col-md-12 d-flex align-items-end pb-2">
              <div class="d-flex align-items-center gap-4 flex-wrap">
                <label class="toggle-label">
                  <input type="radio" formControlName="hasOvertime" [value]="true"
                         [attr.disabled]="isViewOnly() ? true : null">
                  <span>Overtime</span>
                </label>
                <label class="toggle-label">
                  <input type="checkbox" formControlName="hasAttendenceBonus"
                         [attr.disabled]="isViewOnly() ? true : null">
                  <span>Attendance Bonus</span>
                </label>
                <label class="toggle-label switch-label">
                  <div class="form-check form-switch mb-0">
                    <input class="form-check-input" type="checkbox"
                           formControlName="isActive"
                           [attr.disabled]="isViewOnly() ? true : null">
                    <span class="ms-1">Active</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ FAMILY INFORMATION ══ -->
      <div class="section-block">
        <div class="section-header d-flex align-items-center justify-content-between">
          <span>Family Information</span>
          @if (!isViewOnly()) {
            <button type="button" class="btn-add-row" (click)="addFamily()">Add Row</button>
          }
        </div>
        <div class="table-wrap">
          <table class="detail-table w-100">
            <thead>
              <tr>
                <th class="th-num">#</th>
                <th>NAME <span class="req">*</span></th>
                <th>GENDER <span class="req">*</span></th>
                <th>RELATIONSHIP <span class="req">*</span></th>
                <th>DATE OF BIRTH</th>
                <th>CONTACT NO</th>
                <th>CURRENT ADDRESS</th>
                <th>PERMANENT ADDRESS</th>
                @if (!isViewOnly()) { <th class="th-act"></th> }
              </tr>
            </thead>
            <tbody formArrayName="employeeFamilyInfos">
              @if (familyArray.length === 0) {
                <tr><td [attr.colspan]="isViewOnly() ? 8 : 9" class="empty-row">No family records. Click 'Add Row' to add.</td></tr>
              }
              @for (row of familyArray.controls; track $index; let i = $index) {
                <tr [formGroupName]="i">
                  <td class="th-num text-center td-num">{{ i + 1 }}</td>
                  <td><input type="text" class="ti" formControlName="name" maxlength="50" placeholder="Full name"
                             [class.ti-err]="tblErr(familyArray,i,'name')" [readonly]="isViewOnly()"></td>
                  <td>
                    <select class="ts" formControlName="idGender"
                            [class.ti-err]="tblErr(familyArray,i,'idGender')"
                            [attr.disabled]="isViewOnly() ? true : null">
                      <option value="">--</option>
                      @for (g of dd.store().genders; track g.value) { <option [value]="g.value">{{ g.text }}</option> }
                    </select>
                  </td>
                  <td>
                    <select class="ts" formControlName="idRelationship"
                            [class.ti-err]="tblErr(familyArray,i,'idRelationship')"
                            [attr.disabled]="isViewOnly() ? true : null">
                      <option value="">--</option>
                      @for (r of dd.store().relationships; track r.value) { <option [value]="r.value">{{ r.text }}</option> }
                    </select>
                  </td>
                  <td><input type="date" class="ti" formControlName="dateOfBirth" [readonly]="isViewOnly()"></td>
                  <td><input type="text" class="ti" formControlName="contactNo" maxlength="50" [readonly]="isViewOnly()"></td>
                  <td><input type="text" class="ti" formControlName="currentAddress" maxlength="500" [readonly]="isViewOnly()"></td>
                  <td><input type="text" class="ti" formControlName="permanentAddress" maxlength="500" [readonly]="isViewOnly()"></td>
                  @if (!isViewOnly()) {
                    <td class="th-act text-center">
                      <button type="button" class="btn-rm" (click)="familyArray.removeAt(i)"><i class="bi bi-x-lg"></i></button>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- ══ EDUCATION INFORMATION ══ -->
      <div class="section-block">
        <div class="section-header d-flex align-items-center justify-content-between">
          <span>Education Information</span>
          @if (!isViewOnly()) {
            <button type="button" class="btn-add-row" (click)="addEducation()">Add Row</button>
          }
        </div>
        <div class="table-wrap">
          <table class="detail-table w-100">
            <thead>
              <tr>
                <th class="th-num">#</th>
                <th>LEVEL <span class="req">*</span></th>
                <th>EXAMINATION <span class="req">*</span></th>
                <th>RESULT <span class="req">*</span></th>
                <th>MAJOR <span class="req">*</span></th>
                <th>PASSING YEAR <span class="req">*</span></th>
                <th>INSTITUTE <span class="req">*</span></th>
                <th>CGPA</th>
                <th>SCALE</th>
                <th>MARKS</th>
                <th>FOREIGN</th>
                <th>DURATION</th>
                <th>ACHIEVEMENT</th>
                @if (!isViewOnly()) { <th class="th-act"></th> }
              </tr>
            </thead>
            <tbody formArrayName="employeeEducationInfos">
              @if (educationArray.length === 0) {
                <tr><td [attr.colspan]="isViewOnly() ? 13 : 14" class="empty-row">No education records. Click 'Add Row' to add.</td></tr>
              }
              @for (row of educationArray.controls; track $index; let i = $index) {
                <tr [formGroupName]="i">
                  <td class="text-center td-num">{{ i + 1 }}</td>
                  <td>
                    <select class="ts" formControlName="idEducationLevel"
                            [class.ti-err]="tblErr(educationArray,i,'idEducationLevel')"
                            [attr.disabled]="isViewOnly() ? true : null">
                      <option value="">--</option>
                      @for (l of dd.store().educationLevels; track l.value) { <option [value]="l.value">{{ l.text }}</option> }
                    </select>
                  </td>
                  <td>
                    <select class="ts" formControlName="idEducationExamination"
                            [class.ti-err]="tblErr(educationArray,i,'idEducationExamination')"
                            [attr.disabled]="isViewOnly() ? true : null">
                      <option value="">--</option>
                      @for (e of dd.store().educationExaminations; track e.value) { <option [value]="e.value">{{ e.text }}</option> }
                    </select>
                  </td>
                  <td><input type="text" class="ti w80" formControlName="idEducationResult"
                             [class.ti-err]="tblErr(educationArray,i,'idEducationResult')" [readonly]="isViewOnly()"></td>
                  <td><input type="text" class="ti" formControlName="major" maxlength="50" placeholder="CSE"
                             [class.ti-err]="tblErr(educationArray,i,'major')" [readonly]="isViewOnly()"></td>
                  <td><input type="number" class="ti w80" formControlName="passingYear" min="1970" max="2030"
                             [class.ti-err]="tblErr(educationArray,i,'passingYear')" [readonly]="isViewOnly()"></td>
                  <td><input type="text" class="ti" formControlName="instituteName" maxlength="250"
                             [class.ti-err]="tblErr(educationArray,i,'instituteName')" [readonly]="isViewOnly()"></td>
                  <td><input type="number" class="ti w70" formControlName="cgpa" step="0.01" [readonly]="isViewOnly()"></td>
                  <td><input type="number" class="ti w70" formControlName="examScale" step="0.01" [readonly]="isViewOnly()"></td>
                  <td><input type="number" class="ti w70" formControlName="marks" [readonly]="isViewOnly()"></td>
                  <td class="text-center">
                    <input type="checkbox" class="form-check-input" formControlName="isForeignInstitute"
                           [attr.disabled]="isViewOnly() ? true : null">
                  </td>
                  <td><input type="number" class="ti w70" formControlName="duration" step="0.5" [readonly]="isViewOnly()"></td>
                  <td><input type="text" class="ti" formControlName="achievement" maxlength="500" [readonly]="isViewOnly()"></td>
                  @if (!isViewOnly()) {
                    <td class="th-act text-center">
                      <button type="button" class="btn-rm" (click)="educationArray.removeAt(i)"><i class="bi bi-x-lg"></i></button>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- ══ DOCUMENTS + CERTIFICATIONS (two columns) ══ -->
      <div class="row g-0">
        <!-- Documents -->
        <div class="col-lg-6 col-12 pe-lg-1">
          <div class="section-block">
            <div class="section-header d-flex align-items-center justify-content-between">
              <span>Documents</span>
              @if (!isViewOnly()) {
                <button type="button" class="btn-add-row" (click)="addDocument()">Add Row</button>
              }
            </div>
            <div class="table-wrap">
              <table class="detail-table w-100">
                <thead>
                  <tr>
                    <th class="th-num">#</th>
                    <th>DOCUMENT NAME <span class="req">*</span></th>
                    <th>FILE NAME <span class="req">*</span></th>
                    <th>UPLOAD DATE <span class="req">*</span></th>
                    <th>EXT</th>
                    @if (!isViewOnly()) { <th class="th-act"></th> }
                  </tr>
                </thead>
                <tbody formArrayName="employeeDocuments">
                  @if (documentArray.length === 0) {
                    <tr><td [attr.colspan]="isViewOnly() ? 5 : 6" class="empty-row">No documents. Click 'Add Row' to upload.</td></tr>
                  }
                  @for (row of documentArray.controls; track $index; let i = $index) {
                    <tr [formGroupName]="i">
                      <td class="text-center td-num">{{ i + 1 }}</td>
                      <td><input type="text" class="ti" formControlName="documentName" maxlength="200"
                                 [class.ti-err]="tblErr(documentArray,i,'documentName')" [readonly]="isViewOnly()"></td>
                      <td>
                        @if (!isViewOnly()) {
                          <label class="file-lbl">
                            <input type="file" class="d-none" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                   (change)="onDocFile($event, i)">
                            <span class="file-name-text">
                              {{ asGroup(documentArray.at(i)).get('fileName')?.value || 'Choose file...' }}
                            </span>
                          </label>
                        } @else {
                          <span class="ti-ro">{{ asGroup(documentArray.at(i)).get('fileName')?.value }}</span>
                        }
                      </td>
                      <td><input type="date" class="ti" formControlName="uploadDate" [readonly]="isViewOnly()"></td>
                      <td><input type="text" class="ti w60" formControlName="uploadedFileExtention"
                                 maxlength="10" [readonly]="true"></td>
                      @if (!isViewOnly()) {
                        <td class="th-act text-center">
                          <button type="button" class="btn-rm" (click)="documentArray.removeAt(i)"><i class="bi bi-x-lg"></i></button>
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Certifications -->
        <div class="col-lg-6 col-12 ps-lg-1">
          <div class="section-block">
            <div class="section-header d-flex align-items-center justify-content-between">
              <span>Professional Certifications</span>
              @if (!isViewOnly()) {
                <button type="button" class="btn-add-row" (click)="addCertification()">Add Row</button>
              }
            </div>
            <div class="table-wrap">
              <table class="detail-table w-100">
                <thead>
                  <tr>
                    <th class="th-num">#</th>
                    <th>CERTIFICATION TITLE <span class="req">*</span></th>
                    <th>INSTITUTE <span class="req">*</span></th>
                    <th>LOCATION <span class="req">*</span></th>
                    <th>FROM DATE <span class="req">*</span></th>
                    <th>TO DATE</th>
                    @if (!isViewOnly()) { <th class="th-act"></th> }
                  </tr>
                </thead>
                <tbody formArrayName="employeeProfessionalCertifications">
                  @if (certificationArray.length === 0) {
                    <tr><td [attr.colspan]="isViewOnly() ? 6 : 7" class="empty-row">No certifications. Click 'Add Row' to add.</td></tr>
                  }
                  @for (row of certificationArray.controls; track $index; let i = $index) {
                    <tr [formGroupName]="i">
                      <td class="text-center td-num">{{ i + 1 }}</td>
                      <td><input type="text" class="ti" formControlName="certificationTitle" maxlength="255"
                                 [class.ti-err]="tblErr(certificationArray,i,'certificationTitle')" [readonly]="isViewOnly()"></td>
                      <td><input type="text" class="ti" formControlName="certificationInstitute" maxlength="250"
                                 [class.ti-err]="tblErr(certificationArray,i,'certificationInstitute')" [readonly]="isViewOnly()"></td>
                      <td><input type="text" class="ti" formControlName="instituteLocation" maxlength="250"
                                 [class.ti-err]="tblErr(certificationArray,i,'instituteLocation')" [readonly]="isViewOnly()"></td>
                      <td><input type="date" class="ti" formControlName="fromDate"
                                 [class.ti-err]="tblErr(certificationArray,i,'fromDate')" [readonly]="isViewOnly()"></td>
                      <td><input type="date" class="ti" formControlName="toDate" [readonly]="isViewOnly()"></td>
                      @if (!isViewOnly()) {
                        <td class="th-act text-center">
                          <button type="button" class="btn-rm" (click)="certificationArray.removeAt(i)"><i class="bi bi-x-lg"></i></button>
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /form-body -->
  </div>
  `,
  styles: [`
    :host { display:flex; flex-direction:column; height:100%; }

    .hrm-form-root {
      display: flex; flex-direction: column;
      height: 100%; background: #dde3ea;
      font-size: 13px;
    }

    /* Top bar */
    .top-bar {
      background: #1a2e45; height: 46px; flex-shrink: 0;
      position: sticky; top: 0; z-index: 50;
    }
    .top-bar-title { color:#fff; font-size:0.9rem; font-weight:600; }
    .emp-id-badge { color:rgba(255,255,255,0.5); font-weight:400; font-size:0.8rem; }
    .btn-action {
      border:none; border-radius:4px; padding:5px 16px;
      font-size:0.78rem; font-weight:600; cursor:pointer;
      transition:filter 0.15s;
    }
    .btn-action:hover  { filter:brightness(1.12); }
    .btn-action:disabled { opacity:0.6; cursor:not-allowed; }
    .btn-add   { background:#22c55e; color:#fff; }
    .btn-reset { background:#ef4444; color:#fff; }
    .btn-toggle{ background:#3b82f6; color:#fff; }

    /* Form body */
    .form-body { flex:1; overflow-y:auto; padding:10px 12px 20px; }

    /* Section */
    .section-block {
      background:#fff; border:1px solid #c5cdd6;
      border-radius:3px; margin-bottom:10px; overflow:hidden;
    }
    .section-header {
      background:#1a3a5c; color:#fff;
      font-size:0.78rem; font-weight:600;
      padding:7px 12px; letter-spacing:0.02em;
    }
    .section-body { padding:12px 12px 8px; }

    /* Field labels */
    .field-label {
      font-size:0.65rem; font-weight:700; color:#4b5563;
      letter-spacing:0.05em; text-transform:uppercase;
      display:block; margin-bottom:4px;
    }
    .req { color:#dc2626; }
    .err-msg { color:#dc2626; font-size:0.68rem; margin-top:2px; }

    /* Inputs */
    .fld {
      height:32px; font-size:0.78rem; border-radius:3px;
      border:1px solid #cbd5e1; background:#f9fafb;
      padding:4px 8px; color:#1e293b;
    }
    .fld:focus { border-color:#3b82f6; box-shadow:0 0 0 2px rgba(59,130,246,0.15); background:#fff; outline:none; }
    .fld.is-invalid { border-color:#ef4444; }

    /* Toggle row */
    .toggle-label {
      display:flex; align-items:center; gap:5px;
      font-size:0.75rem; font-weight:500; color:#374151; cursor:pointer;
    }
    .switch-label .form-check { display:flex; align-items:center; gap:5px; }

    /* Add Row button */
    .btn-add-row {
      background:#334155; color:#fff; border:none;
      border-radius:3px; padding:3px 10px;
      font-size:0.72rem; font-weight:600; cursor:pointer;
    }
    .btn-add-row:hover { background:#1e293b; }

    /* Remove button */
    .btn-rm {
      background:none; border:none; color:#dc2626;
      font-size:0.7rem; cursor:pointer; padding:2px 5px;
      border-radius:3px; line-height:1;
    }
    .btn-rm:hover { background:#fee2e2; }

    /* Table wrapper */
    .table-wrap { overflow-x:auto; }

    /* Detail table */
    .detail-table { border-collapse:collapse; font-size:0.72rem; }
    .detail-table thead th {
      background:#eef2f7; color:#475569;
      font-size:0.62rem; font-weight:700;
      letter-spacing:0.04em; white-space:nowrap;
      padding:5px 8px; border-bottom:2px solid #cbd5e1;
      border-right:1px solid #e2e8f0;
    }
    .detail-table thead th:last-child { border-right:none; }
    .detail-table tbody tr:nth-child(even) { background:#f8fafc; }
    .detail-table tbody tr:hover { background:#eff6ff; }
    .detail-table td {
      padding:3px 4px; border-bottom:1px solid #e5e7eb;
      border-right:1px solid #f1f5f9; vertical-align:middle;
    }
    .detail-table td:last-child { border-right:none; }
    .th-num { width:30px; }
    .td-num { color:#94a3b8; font-weight:600; font-size:0.68rem; }
    .th-act { width:34px; }
    .empty-row {
      text-align:center; color:#94a3b8; font-style:italic;
      padding:14px !important; font-size:0.72rem;
    }

    /* Table input/select */
    .ti, .ts {
      width:100%; min-width:70px; border:1px solid transparent;
      border-radius:2px; padding:2px 5px;
      font-size:0.72rem; height:26px;
      background:transparent; color:#1e293b;
      transition:border-color 0.15s, background 0.15s;
    }
    .ti:hover, .ts:hover { border-color:#cbd5e1; background:#fff; }
    .ti:focus, .ts:focus {
      outline:none; border-color:#3b82f6;
      box-shadow:0 0 0 2px rgba(59,130,246,0.12);
      background:#fff;
    }
    .ti[readonly] { color:#64748b; cursor:default; }
    .ti.ti-err, .ts.ti-err { border-color:#ef4444 !important; background:#fff5f5; }
    .ti-ro { font-size:0.72rem; color:#64748b; padding:2px 5px; display:block; }
    .w80 { max-width:90px; }
    .w70 { max-width:80px; }
    .w60 { max-width:72px; }

    /* File picker */
    .file-lbl { cursor:pointer; display:flex; align-items:center; }
    .file-name-text {
      font-size:0.7rem; color:#374151;
      border-bottom:1px dashed #94a3b8;
      white-space:nowrap; overflow:hidden;
      text-overflow:ellipsis; max-width:130px;
    }
    .file-name-text:hover { color:#3b82f6; border-color:#3b82f6; }

    @media (max-width:576px) {
      .form-body { padding:6px; }
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  state    = inject(EmployeeStateService);
  dd       = inject(DropdownService);
  private fb       = inject(FormBuilder);
  private fileUtil = inject(FileUtilService);
  private toast    = inject(ToastService);

  isViewOnly = signal(false);
  form!: FormGroup;

  get familyArray():        FormArray { return this.form.get('employeeFamilyInfos') as FormArray; }
  get educationArray():     FormArray { return this.form.get('employeeEducationInfos') as FormArray; }
  get documentArray():      FormArray { return this.form.get('employeeDocuments') as FormArray; }
  get certificationArray(): FormArray { return this.form.get('employeeProfessionalCertifications') as FormArray; }

  showErr(n: string): boolean {
    const c = this.form.get(n);
    return !!(c?.invalid && (c.dirty || c.touched));
  }
  tblErr(arr: FormArray, i: number, f: string): boolean {
    const c = (arr.at(i) as FormGroup).get(f);
    return !!(c?.invalid && c.touched);
  }
  asGroup(ctrl: AbstractControl): FormGroup { return ctrl as FormGroup; }
  toggleViewMode() { this.isViewOnly.update(v => !v); }

  ngOnInit() {
    this.buildForm();
    this.dd.loadAll();
    this.state.loadList();
    effect(() => {
      const emp  = this.state.selectedEmployee();
      const mode = this.state.mode();
      if (emp) { this.patchForm(emp); this.isViewOnly.set(mode === 'edit'); }
    }, { allowSignalWrites: true });
  }

  private buildForm() {
    this.form = this.fb.group({
      idClient:      [environment.clientId],
      id:            [null],
      employeeName:  ['', [Validators.required, Validators.maxLength(250)]],
      employeeNameBangla: ['', Validators.maxLength(250)],
      employeeImage: [null],
      fatherName:    ['', Validators.maxLength(250)],
      motherName:    ['', Validators.maxLength(250)],
      idReportingManager: [null],
      idJobType:     [null], idEmployeeType: [null],
      birthDate: [null], joiningDate: [null],
      idGender: [null], idReligion: [null],
      idDepartment:  ['', Validators.required],
      idSection:     ['', Validators.required],
      idDesignation: [null],
      hasOvertime: [false], hasAttendenceBonus: [false],
      idWeekOff: [null],
      address: ['', Validators.maxLength(250)],
      presentAddress: ['', Validators.maxLength(250)],
      nationalIdentificationNumber: ['', Validators.maxLength(30)],
      contactNo: ['', Validators.maxLength(250)],
      idMaritalStatus: [null], isActive: [true], createdBy: [''],
      employeeFamilyInfos:                this.fb.array([]),
      employeeEducationInfos:             this.fb.array([]),
      employeeDocuments:                  this.fb.array([]),
      employeeProfessionalCertifications: this.fb.array([]),
    });
  }

  private patchForm(emp: EmployeeDto) {
    this.familyArray.clear(); this.educationArray.clear();
    this.documentArray.clear(); this.certificationArray.clear();
    this.form.patchValue({ ...emp,
      birthDate:   emp.birthDate?.substring(0,10)   ?? null,
      joiningDate: emp.joiningDate?.substring(0,10) ?? null,
    });
    emp.employeeFamilyInfos?.forEach(f => this.familyArray.push(this.fb.group({
      id:[f.id], idEmployee:[f.idEmployee],
      name:[f.name,[Validators.required,Validators.maxLength(50)]],
      idRelationship:[f.idRelationship,Validators.required],
      idGender:[f.idGender,Validators.required],
      dateOfBirth:[f.dateOfBirth?.substring(0,10)??null],
      contactNo:[f.contactNo,Validators.maxLength(50)],
      currentAddress:[f.currentAddress,Validators.maxLength(500)],
      permanentAddress:[f.permanentAddress,Validators.maxLength(500)],
    })));
    emp.employeeEducationInfos?.forEach(e => this.educationArray.push(this.fb.group({
      id:[e.id], idEmployee:[e.idEmployee],
      idEducationLevel:[e.idEducationLevel,Validators.required],
      idEducationExamination:[e.idEducationExamination,Validators.required],
      idEducationResult:[e.idEducationResult,Validators.required],
      major:[e.major,[Validators.required,Validators.maxLength(50)]],
      passingYear:[e.passingYear,Validators.required],
      instituteName:[e.instituteName,[Validators.required,Validators.maxLength(250)]],
      isForeignInstitute:[e.isForeignInstitute??false],
      cgpa:[e.cgpa], examScale:[e.examScale], marks:[e.marks],
      duration:[e.duration], achievement:[e.achievement,Validators.maxLength(500)],
    })));
    emp.employeeDocuments?.forEach(d => this.documentArray.push(this.fb.group({
      id:[d.id], idEmployee:[d.idEmployee],
      documentName:[d.documentName,[Validators.required,Validators.maxLength(200)]],
      fileName:[d.fileName,[Validators.required,Validators.maxLength(100)]],
      uploadDate:[d.uploadDate?.substring(0,10)],
      uploadedFileExtention:[d.uploadedFileExtention,Validators.maxLength(10)],
      uploadedFile:[d.uploadedFile],
    })));
    emp.employeeProfessionalCertifications?.forEach(c => this.certificationArray.push(this.fb.group({
      id:[c.id], idEmployee:[c.idEmployee],
      certificationTitle:[c.certificationTitle,[Validators.required,Validators.maxLength(255)]],
      certificationInstitute:[c.certificationInstitute,[Validators.required,Validators.maxLength(250)]],
      instituteLocation:[c.instituteLocation,[Validators.required,Validators.maxLength(250)]],
      fromDate:[c.fromDate?.substring(0,10),Validators.required],
      toDate:[c.toDate?.substring(0,10)??null],
    })));
  }

  addFamily() {
    this.familyArray.push(this.fb.group({
      id:[null], idEmployee:[0],
      name:['', [Validators.required,Validators.maxLength(50)]],
      idRelationship:['',Validators.required],
      idGender:['',Validators.required],
      dateOfBirth:[null], contactNo:['',Validators.maxLength(50)],
      currentAddress:['',Validators.maxLength(500)],
      permanentAddress:['',Validators.maxLength(500)],
    }));
  }

  addEducation() {
    this.educationArray.push(this.fb.group({
      id:[null], idEmployee:[0],
      idEducationLevel:['',Validators.required],
      idEducationExamination:['',Validators.required],
      idEducationResult:['',Validators.required],
      major:['', [Validators.required,Validators.maxLength(50)]],
      passingYear:['',Validators.required],
      instituteName:['', [Validators.required,Validators.maxLength(250)]],
      isForeignInstitute:[false],
      cgpa:[null], examScale:[null], marks:[null], duration:[null],
      achievement:['',Validators.maxLength(500)],
    }));
  }

  addDocument() {
    this.documentArray.push(this.fb.group({
      id:[null], idEmployee:[0],
      documentName:['', [Validators.required,Validators.maxLength(200)]],
      fileName:['', [Validators.required,Validators.maxLength(100)]],
      uploadDate:[new Date().toISOString().substring(0,10)],
      uploadedFileExtention:['',Validators.maxLength(10)],
      uploadedFile:[null],
    }));
  }

  addCertification() {
    this.certificationArray.push(this.fb.group({
      id:[null], idEmployee:[0],
      certificationTitle:['', [Validators.required,Validators.maxLength(255)]],
      certificationInstitute:['', [Validators.required,Validators.maxLength(250)]],
      instituteLocation:['', [Validators.required,Validators.maxLength(250)]],
      fromDate:['',Validators.required], toDate:[null],
    }));
  }

  async onDocFile(event: Event, i: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const r = await this.fileUtil.toBase64(file);
    (this.documentArray.at(i) as FormGroup).patchValue({
      fileName: r.fileName, uploadedFileExtention: r.extension,
      uploadedFile: r.base64, uploadDate: new Date().toISOString().substring(0,10),
    });
    const nc = (this.documentArray.at(i) as FormGroup).get('documentName');
    if (!nc?.value) nc?.setValue(file.name.split('.')[0]);
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { this.toast.warning('Please fill all required fields.'); return; }
    this.state.save(this.buildDto());
  }

  onReset() {
    if (this.state.mode() === 'add') { this.buildForm(); this.state.startNew(); }
    else { const e = this.state.selectedEmployee(); if (e) { this.patchForm(e); this.isViewOnly.set(true); } }
  }

  private buildDto(): EmployeeDto {
    const r = this.form.getRawValue();
    return {
      ...r, idClient: environment.clientId,
      birthDate:   r.birthDate   ? new Date(r.birthDate).toISOString()   : null,
      joiningDate: r.joiningDate ? new Date(r.joiningDate).toISOString() : null,
      employeeFamilyInfos: r.employeeFamilyInfos.map((f: any) => ({
        ...f, idEmployee: r.id??0,
        dateOfBirth: f.dateOfBirth ? new Date(f.dateOfBirth).toISOString() : null,
      })),
      employeeEducationInfos: r.employeeEducationInfos.map((e: any) => ({...e, idEmployee: r.id??0})),
      employeeDocuments: r.employeeDocuments.map((d: any) => ({
        ...d, idEmployee: r.id??0,
        uploadDate: d.uploadDate ? new Date(d.uploadDate).toISOString() : new Date().toISOString(),
      })),
      employeeProfessionalCertifications: r.employeeProfessionalCertifications.map((c: any) => ({
        ...c, idEmployee: r.id??0,
        fromDate: c.fromDate ? new Date(c.fromDate).toISOString() : '',
        toDate:   c.toDate   ? new Date(c.toDate).toISOString()   : null,
      })),
    };
  }
}
