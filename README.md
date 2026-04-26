# HRM Employee Management — Angular 21 (Standalone + Signals)

## Quick Start
```bash
# 1. Create new Angular project
ng new hrm-app --standalone --routing --style=scss --ssr=false
cd hrm-app

# 2. Copy all files from this package into the project

# 3. Install dependencies
npm install

# 4. Run dev server
ng serve --open
```

---

## Project Structure
```
src/
├── environments/
│   └── environment.ts              ← API base URL + clientId
├── app/
│   ├── app.component.ts            ← Root shell (navbar + router-outlet + toast)
│   ├── app.config.ts               ← provideRouter, provideHttpClient
│   ├── app.routes.ts               ← Routes: / → /employee
│   │
│   ├── core/
│   │   ├── models/
│   │   │   └── index.ts            ← All DTOs (EmployeeDto, DropdownDto, etc.)
│   │   └── services/
│   │       ├── employee-api.service.ts    ← All HTTP calls (GET/POST/PUT/DELETE)
│   │       ├── employee-state.service.ts ← Global signal store (list, selected, mode)
│   │       ├── dropdown.service.ts       ← Cached dropdowns (forkJoin on init)
│   │       ├── toast.service.ts          ← Global notifications (success/error/warning)
│   │       └── file-util.service.ts      ← File→Base64, icon helper, size formatter
│   │
│   ├── shared/
│   │   └── components/
│   │       ├── navbar.component.ts       ← Top navbar
│   │       └── toast.component.ts        ← Toast notification renderer
│   │
│   └── features/
│       └── employee/
│           └── components/
│               ├── employee-list/
│               │   └── employee-list.component.ts   ← Sidebar list w/ search
│               ├── employee-form/
│               │   ├── employee-form.component.ts   ← Master form (6 tabs)
│               │   └── employee-page.component.ts   ← Layout: sidebar + form
│               ├── family-info/
│               │   └── family-info.component.ts     ← FormArray detail rows
│               ├── education-info/
│               │   └── education-info.component.ts  ← FormArray detail rows
│               ├── document-upload/
│               │   └── document-upload.component.ts ← File upload + base64
│               └── certification/
│                   └── certification.component.ts   ← FormArray detail rows
└── styles.scss                     ← Global styles (Bootstrap extended)
```

---

## API Endpoints Mapped
| Feature | Method | Endpoint |
|---|---|---|
| List employees | GET | `/api/employee?clientId=1` |
| Get details | GET | `/api/employee/details?clientId=1&id=X` |
| Add employee | POST | `/api/employee` |
| Update employee | PUT | `/api/employee?clientId=1&id=X` |
| Delete employee | DELETE | `/api/employee?clientId=1&id=X` |
| Dropdowns | GET | `/api/common/{name}dropdown?clientId=1` |

---

## Forms & Validation Summary

### Master (EmployeeDto)
| Field | Validation |
|---|---|
| employeeName | required, maxLength 250 |
| idDepartment | required |
| idSection | required |
| contactNo | maxLength 250 |
| address / presentAddress | maxLength 250 |
| nationalIdentificationNumber | maxLength 30 |
| employeeNameBangla | maxLength 250 |

### Family Info (detail rows)
| Field | Validation |
|---|---|
| name | required, maxLength 50 |
| idRelationship | required |
| idGender | required |
| contactNo | maxLength 50 |
| currentAddress / permanentAddress | maxLength 500 |

### Education Info (detail rows)
| Field | Validation |
|---|---|
| idEducationLevel | required |
| idEducationExamination | required |
| major | required, maxLength 50 |
| passingYear | required |
| instituteName | required, maxLength 250 |
| achievement | maxLength 500 |

### Documents (detail rows)
| Field | Validation |
|---|---|
| documentName | required, maxLength 200 |
| fileName | required, maxLength 100 |
| uploadedFileExtention | maxLength 10 |
| uploadedFile | base64 string (auto-converted) |

### Professional Certifications (detail rows)
| Field | Validation |
|---|---|
| certificationTitle | required, maxLength 255 |
| certificationInstitute | required, maxLength 250 |
| instituteLocation | required, maxLength 250 |
| fromDate | required |

---

## Key Features
- ✅ Angular 21 standalone components
- ✅ Signal-based state management (no NgRx needed)
- ✅ Master-detail form with 6 tabs
- ✅ Add / Edit / View modes with toggle
- ✅ Photo upload → base64 preview
- ✅ Document upload → base64 → server
- ✅ FormArray for Family, Education, Documents, Certifications
- ✅ All dropdowns cached in one forkJoin call
- ✅ Employee sidebar with search + add + delete
- ✅ Mobile responsive (sidebar drawer on mobile)
- ✅ Toast notification system
- ✅ Skeleton loading state
- ✅ Full validation with error messages
- ✅ Bootstrap 5.3 + Bootstrap Icons

---

## Configuration
Edit `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7223',  // ← Your API URL
  clientId: 1                        // ← Your client ID
};
```
