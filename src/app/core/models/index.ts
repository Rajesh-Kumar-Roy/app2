// ==================== models/dropdown.model.ts ====================
export interface DropdownDto {
  value: number;
  text: string;
}

// ==================== models/employee.model.ts ====================
export interface EmployeeListDto {
  id: number;
  clientId: number;
  employeeName: string | null;
  designationName: string;
}

export interface EmployeeDocumentDto {
  idClient?: number;
  id?: number;
  idEmployee: number;
  documentName: string;       // maxLength: 200
  fileName: string;           // maxLength: 100
  uploadDate: string;         // date-time
  uploadedFileExtention?: string | null;  // maxLength: 10
  uploadedFile?: string | null;           // base64 string
  setDate?: string | null;
}

export interface EmployeeFamilyInfoDto {
  idClient?: number;
  id?: number;
  idEmployee: number;
  name: string;               // maxLength: 50, required
  idGender: number;           // required
  idRelationship: number;     // required
  dateOfBirth?: string | null;
  contactNo?: string | null;  // maxLength: 50
  currentAddress?: string | null;  // maxLength: 500
  permanentAddress?: string | null; // maxLength: 500
  setDate?: string | null;
  createdBy?: string | null;  // maxLength: 50
}

export interface EmployeeEducationInfoDto {
  idClient?: number;
  id?: number;
  idEmployee: number;
  idEducationLevel: number;       // required
  idEducationExamination: number; // required
  idEducationResult: number;      // required
  cgpa?: number | null;
  examScale?: number | null;
  marks?: number | null;
  major: string;              // maxLength: 50, required
  passingYear: number;        // required
  instituteName: string;      // maxLength: 250, required
  isForeignInstitute?: boolean;
  duration?: number | null;
  achievement?: string | null; // maxLength: 500
  setDate?: string | null;
}

export interface EmployeeProfessionalCertificationDto {
  idClient?: number;
  id?: number;
  idEmployee: number;
  certificationTitle: string;     // maxLength: 255, required
  certificationInstitute: string; // maxLength: 250, required
  instituteLocation: string;      // maxLength: 250, required
  fromDate: string;               // required, date-time
  toDate?: string | null;
  setDate?: string | null;
  createdBy?: string | null;      // maxLength: 50
}

export interface EmployeeDto {
  idClient: number;               // required
  id?: number;
  employeeName: string | null;    // maxLength: 250, required
  employeeNameBangla?: string | null; // maxLength: 250
  employeeImage?: string | null;  // base64
  fatherName?: string | null;     // maxLength: 250
  motherName?: string | null;     // maxLength: 250
  idReportingManager?: number | null;
  idJobType?: number | null;
  idEmployeeType?: number | null;
  birthDate?: string | null;
  joiningDate?: string | null;
  idGender?: number | null;
  idReligion?: number | null;
  idDepartment: number;           // required
  idSection: number;              // required
  idDesignation?: number | null;
  hasOvertime?: boolean | null;
  hasAttendenceBonus?: boolean | null;
  idWeekOff?: number | null;
  address?: string | null;        // maxLength: 250
  presentAddress?: string | null; // maxLength: 250
  nationalIdentificationNumber?: string | null; // maxLength: 30
  contactNo?: string | null;      // maxLength: 250
  idMaritalStatus?: number | null;
  isActive?: boolean | null;
  setDate?: string | null;
  createdBy?: string | null;      // maxLength: 50
  employeeDocuments?: EmployeeDocumentDto[];
  employeeEducationInfos?: EmployeeEducationInfoDto[];
  employeeFamilyInfos?: EmployeeFamilyInfoDto[];
  employeeProfessionalCertifications?: EmployeeProfessionalCertificationDto[];
}

export type FormMode = 'add' | 'edit' | 'view';
