import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DropdownDto } from '../models';
import { EmployeeApiService } from './employee-api.service';

export interface DropdownStore {
  departments: DropdownDto[];
  sections: DropdownDto[];
  designations: DropdownDto[];
  genders: DropdownDto[];
  religions: DropdownDto[];
  maritalStatuses: DropdownDto[];
  jobTypes: DropdownDto[];
  employeeTypes: DropdownDto[];
  weekOffs: DropdownDto[];
  relationships: DropdownDto[];
  educationLevels: DropdownDto[];
  educationExaminations: DropdownDto[];
}

@Injectable({ providedIn: 'root' })
export class DropdownService {
  private api = inject(EmployeeApiService);

  readonly store = signal<DropdownStore>({
    departments: [], sections: [], designations: [],
    genders: [], religions: [], maritalStatuses: [],
    jobTypes: [], employeeTypes: [], weekOffs: [],
    relationships: [], educationLevels: [], educationExaminations: []
  });

  readonly loaded = signal(false);

  loadAll(): void {
    if (this.loaded()) return;
    forkJoin({
      departments: this.api.getDepartments(),
      sections: this.api.getSections(),
      designations: this.api.getDesignations(),
      genders: this.api.getGenders(),
      religions: this.api.getReligions(),
      maritalStatuses: this.api.getMaritalStatuses(),
      jobTypes: this.api.getJobTypes(),
      employeeTypes: this.api.getEmployeeTypes(),
      weekOffs: this.api.getWeekOffs(),
      relationships: this.api.getRelationships(),
      educationLevels: this.api.getEducationLevels(),
      educationExaminations: this.api.getEducationExaminations()
    }).subscribe(data => {
      this.store.set(data);
      this.loaded.set(true);
    });
  }

  getLabelByValue(list: DropdownDto[], value: number | null | undefined): string {
    if (value == null) return '—';
    return list.find(d => d.value === value)?.text ?? '—';
  }
}
