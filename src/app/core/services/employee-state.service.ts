import { Injectable, inject, signal, computed } from '@angular/core';
import { EmployeeDto, EmployeeListDto, FormMode } from '../models';
import { EmployeeApiService } from './employee-api.service';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeStateService {
  private api = inject(EmployeeApiService);
  private toast = inject(ToastService);

  // ── Signals ───────────────────────────────────────────────────
  readonly employeeList = signal<EmployeeListDto[]>([]);
  readonly selectedEmployee = signal<EmployeeDto | null>(null);
  readonly mode = signal<FormMode>('add');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly searchQuery = signal('');

  readonly filteredList = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.employeeList().filter(e =>
      (e.employeeName ?? '').toLowerCase().includes(q) ||
      (e.designationName ?? '').toLowerCase().includes(q) ||
      String(e.id).includes(q)
    );
  });

  // ── Actions ───────────────────────────────────────────────────
  loadList(): void {
    this.loading.set(true);
    this.api.getEmployeeList().subscribe({
      next: list => { this.employeeList.set(list); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load employee list'); this.loading.set(false); }
    });
  }

  selectEmployee(id: number): void {
    this.loading.set(true);
    this.api.getEmployeeDetails(id).subscribe({
      next: emp => {
        this.selectedEmployee.set(emp);
        this.mode.set('edit');
        this.loading.set(false);
      },
      error: () => { this.toast.error('Failed to load employee details'); this.loading.set(false); }
    });
  }

  startNew(): void {
    this.selectedEmployee.set({
      idClient: environment.clientId,
      employeeName: null,
      idDepartment: 0,
      idSection: 0,
      isActive: true,
      employeeDocuments: [],
      employeeEducationInfos: [],
      employeeFamilyInfos: [],
      employeeProfessionalCertifications: []
    });
    this.mode.set('add');
  }

  save(dto: EmployeeDto): void {
    this.saving.set(true);
    const isEdit = this.mode() === 'edit' && !!dto.id;
    const call = isEdit
      ? this.api.updateEmployee(dto.id!, dto)
      : this.api.addEmployee(dto);

    call.subscribe({
      next: () => {
        this.toast.success(isEdit ? 'Employee updated successfully' : 'Employee added successfully');
        this.saving.set(false);
        this.loadList();
        if (!isEdit) this.startNew();
      },
      error: () => {
        this.toast.error('Failed to save employee. Please try again.');
        this.saving.set(false);
      }
    });
  }

  deleteEmployee(id: number): void {
    this.api.deleteEmployee(id).subscribe({
      next: () => {
        this.toast.success('Employee deleted');
        this.employeeList.update(list => list.filter(e => e.id !== id));
        if (this.selectedEmployee()?.id === id) this.startNew();
      },
      error: () => this.toast.error('Failed to delete employee')
    });
  }

  reset(): void {
    this.startNew();
  }
}
