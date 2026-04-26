import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUtilService } from '../../../../core/services/file-util.service';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="detail-section">
      <div class="section-header d-flex align-items-center justify-content-between mb-3">
        <div class="d-flex align-items-center gap-2">
          <div class="section-icon bg-orange">
            <i class="bi bi-folder2-open text-white"></i>
          </div>
          <div>
            <h6 class="mb-0 fw-bold">Documents</h6>
            <small class="text-muted">{{ rows.controls.length }} document(s)</small>
          </div>
        </div>
        @if (!readonly()) {
          <button type="button" class="btn btn-sm btn-outline-warning" (click)="addRow()">
            <i class="bi bi-upload me-1"></i>Upload Doc
          </button>
        }
      </div>

      @if (rows.controls.length === 0) {
        <div class="empty-state text-center py-4">
          <i class="bi bi-file-earmark-arrow-up text-muted fs-2 d-block mb-2"></i>
          <p class="text-muted mb-0 small">No documents uploaded yet</p>
        </div>
      }

      <div class="doc-grid">
        @for (row of rows.controls; track $index; let i = $index) {
          <div class="doc-card" [formGroup]="asGroup(row)">
            <div class="doc-preview">
              @if (asGroup(row).get('isImage')?.value && asGroup(row).get('uploadedFile')?.value) {
                <img [src]="'data:image/*;base64,' + asGroup(row).get('uploadedFile')?.value"
                     class="doc-thumb" alt="preview">
              } @else {
                <div class="doc-icon-wrap">
                  <i [class]="'bi ' + getIcon(asGroup(row).get('uploadedFileExtention')?.value) + ' fs-2'"></i>
                </div>
              }
            </div>
            <div class="doc-info">
              <input type="text" class="form-control form-control-sm mb-1"
                     formControlName="documentName"
                     maxlength="200"
                     placeholder="Document name *"
                     [readonly]="readonly()">
              @if (!readonly()) {
                <input type="file" class="form-control form-control-sm"
                       accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                       (change)="onFileChange($event, i)">
                <div class="d-flex justify-content-between align-items-center mt-1">
                  <small class="text-muted">{{ asGroup(row).get('fileName')?.value || 'No file' }}</small>
                  <button type="button" class="btn btn-xs text-danger" (click)="removeRow(i)">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              } @else {
                <small class="text-muted d-block">{{ asGroup(row).get('fileName')?.value }}</small>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .section-icon { width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center; }
    .bg-orange { background: linear-gradient(135deg,#f97316,#c2410c); }
    .doc-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px; }
    .doc-card {
      border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;
      background:#fff;transition:box-shadow 0.2s;
    }
    .doc-card:hover { box-shadow:0 4px 12px rgba(0,0,0,0.08); }
    .doc-preview {
      height:90px;background:#f8fafc;
      display:flex;align-items:center;justify-content:center;
      border-bottom:1px solid #e5e7eb;overflow:hidden;
    }
    .doc-thumb { width:100%;height:100%;object-fit:cover; }
    .doc-icon-wrap { color:#9ca3af; }
    .doc-info { padding:10px; }
    .form-label-sm { font-size:0.75rem;font-weight:600;color:#374151;margin-bottom:3px;display:block; }
    .empty-state { background:#f9fafb;border-radius:12px;border:2px dashed #d1d5db; }
    .btn-xs { font-size:0.75rem;padding:2px 6px;background:none;border:none; }
  `]
})
export class DocumentUploadComponent {
  readonly = input<boolean>(false);
  formArray = input.required<FormArray>();

  private fb = inject(FormBuilder);
  private fileUtil = inject(FileUtilService);

  get rows(): FormArray { return this.formArray(); }
  asGroup(ctrl: any): FormGroup { return ctrl as FormGroup; }

  getIcon(ext: string): string {
    return this.fileUtil.getFileIcon(ext || '').split(' ')[0];
  }

  addRow() {
    this.rows.push(this.fb.group({
      id: [null],
      idEmployee: [0],
      documentName: ['', [Validators.required, Validators.maxLength(200)]],
      fileName: ['', [Validators.required, Validators.maxLength(100)]],
      uploadDate: [new Date().toISOString()],
      uploadedFileExtention: ['', Validators.maxLength(10)],
      uploadedFile: [null],
      isImage: [false]
    }));
  }

  removeRow(i: number) {
    this.rows.removeAt(i);
  }

  async onFileChange(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const result = await this.fileUtil.toBase64(file);
    const group = this.asGroup(this.rows.at(i));
    group.patchValue({
      fileName: result.fileName,
      uploadedFileExtention: result.extension,
      uploadedFile: result.base64,
      uploadDate: new Date().toISOString(),
      isImage: this.fileUtil.isImageFile(result.extension)
    });
    if (!group.get('documentName')?.value) {
      group.get('documentName')?.setValue(file.name.split('.')[0]);
    }
  }
}
