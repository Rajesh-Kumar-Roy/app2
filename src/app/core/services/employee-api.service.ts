import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DropdownDto, EmployeeDto, EmployeeListDto
} from '../models';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;
  private clientId = environment.clientId;

  // ── Common dropdowns ──────────────────────────────────────────
  getDepartments(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/departmentdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getSections(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/sectionsdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getDesignations(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/designationdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getGenders(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/gendersdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getReligions(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/religionsdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getMaritalStatuses(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/maritalstatusesdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getJobTypes(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/jobtypesdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getEmployeeTypes(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/employeetypesdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getWeekOffs(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/weekoffsdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getRelationships(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/relationshipsdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getEducationLevels(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/educationlevelsdropdown`, {
      params: { clientId: this.clientId }
    });
  }
  getEducationExaminations(): Observable<DropdownDto[]> {
    return this.http.get<DropdownDto[]>(`${this.base}/api/common/educationexaminationsdropdown`, {
      params: { clientId: this.clientId }
    });
  }

  // ── Employee CRUD ─────────────────────────────────────────────
  getEmployeeList(): Observable<EmployeeListDto[]> {
    return this.http.get<EmployeeListDto[]>(`${this.base}/api/employee`, {
      params: { clientId: this.clientId }
    });
  }

  getEmployeeDetails(id: number): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`${this.base}/api/employee/details`, {
      params: { clientId: this.clientId, id }
    });
  }

  addEmployee(dto: EmployeeDto): Observable<any> {
    return this.http.post(`${this.base}/api/employee`, dto);
  }

  updateEmployee(id: number, dto: EmployeeDto): Observable<any> {
    return this.http.put(`${this.base}/api/employee`, dto, {
      params: { clientId: this.clientId, id }
    });
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.base}/api/employee`, {
      params: { clientId: this.clientId, id }
    });
  }
}
